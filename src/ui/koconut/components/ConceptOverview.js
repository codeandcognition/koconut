import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ReactMarkdown from 'react-markdown';
import CodeBlock from './CodeBlock';
import ConceptInventory from './../../../data/ConceptMap';

class ConceptOverview extends Component {
    renderMarkdown(codeString: string, index: number) {
        let code = "```python\n" + codeString + "\n```";
        return <ReactMarkdown className={"flex-grow-1"}
            key={index}
            source={code}
            renderers={{ code: CodeBlock }}
            escapeHtml={true}
        />
    }

    render() {
        let conceptInfo = ConceptInventory[this.props.conceptCode].explanations;
        return(
            <Card>
                <CardContent>
                    <p>{conceptInfo.definition}</p>
                    <p><b>Examples</b></p>
                    {conceptInfo.examples.map((item, index) => {
                        return this.renderMarkdown(item, index);
                    })}
                </CardContent>
            </Card>
        );
    }
}

export default ConceptOverview;