// @flow
import ace from 'brace';
import _ from 'lodash';

const {Range} = ace.acequire('ace/range'); // Ace has a built-in range datatype

/*
 * Exercise code can be encoded with special tags to denote ranges/lines:
 */
const _tags = {
  START: '%%((%%', // start of a range
  END: '%%))%%',   // end of a range
  LINE: '%%>>%%',  // entire line
};

/**
 * Parses exercise code
 * @class
 */
class CodeParser {
  /**
   * Returns a tag-less version of the given code
   * @param code - the code to clean
   * @returns a copy of the given code with all tags removed
   */
  static clean(code: string): string {
    // fancy "make a regex of the tags and replace each instance with nothing"
    let re = Object.values(_tags).
        map((tag: any /* hush */) => _.escapeRegExp(tag)).
        join('|');
    return code.replace(new RegExp(re, 'g'), '');
  }

  /**
   * Returns an array of ranges/lines as tagged in the given code
   * @param code - the code to extract ranges from
   * @returns an array of ranges/lines
   */
  static ranges(code: string): Array<Range | number> {
    let ranges = [];

    // verbose!
    let start = {row: undefined, column: undefined};
    let end = {row: undefined, column: undefined};

    // I think is the best way to iterate and preserve line number
    let lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
      // check if each tag is on the line
      Object.values(_tags).forEach((tag) => {
        if (typeof tag === 'string') {
          let index = lines[i].search(new RegExp(_.escapeRegExp(tag)));

          // add range/line data to ranges if tag found
          if (index !== -1) {
            switch (tag) {
              case(_tags.LINE):
                ranges.push(i);
                break;
              case(_tags.START):
                // validity check
                if (start.row !== undefined || start.column !== undefined) {
                  throw new Error('Repeated START tag in code');
                }

                start.row = i;
                start.column = index;
                break;
              case(_tags.END):
                // validity part 2
                if (end.row !== undefined || end.column !== undefined) {
                  throw new Error('Repeated END tag in code');
                }

                end.row = i;
                end.column = index;

                // shift if start and end are on the same line
                if (start.row === end.row) {
                  end.column -= _tags.START.length;
                }

                ranges.push(
                    new Range(start.row, start.column, end.row, end.column));

                // reset start and end
                start = {};
                end = {};
                break;
              default:
                console.error(`No case for this tag ${tag}`);
            }
          }
        }
      });
    }

    return ranges;
  }
}

export default CodeParser;
