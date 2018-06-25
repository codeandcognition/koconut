// @flow
import React, {Component} from 'react';
import ReactMarkdown from 'react-markdown';
import LargeButton from './LargeButton';

const largeButtonTypes = {
  prev: "PREV",
  next: "NEXT"
}

export default class InstructionContent extends Component {
  render() {
    return (
        <div className={"d-flex"} style={{textAlign: "center", width: "100%"}}>
          <LargeButton click={this.props.prev}
                       type={largeButtonTypes.prev}
                        types={largeButtonTypes}
                       instructionIndex={this.props.currentInstructionIndex}
                       maxInstruction={this.props.maxInstruction}
                        className={"p-2"}/>
          <div style={{textAlign: "left", width: "100%", paddingLeft: "100px"}}>
          <ReactMarkdown className={"flex-grow-1"}
                         source={this.props.instruction.content} />
          </div>
          <LargeButton click={this.props.next}
                       type={largeButtonTypes.next}
                       types={largeButtonTypes}
                       className={"p-2"}
                       instructionIndex={this.props.currentInstructionIndex}
                       maxInstruction={this.props.maxInstruction}/>
        </div>
    )
  }
}"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas non mi nulla. Praesent tempor ante nisi. Proin sollicitudin, ex bibendum molestie aliquam, magna augue lobortis metus, vitae congue ante magna vel elit. Quisque iaculis sapien eget augue mattis, quis imperdiet diam rutrum. Etiam tincidunt, mi aliquam ornare interdum, tortor diam vestibulum est, eget vehicula nisi magna non turpis. Nam vel nunc lobortis, laoreet ex vitae, pulvinar dolor. Fusce sollicitudin nulla dolor, vitae faucibus ex posuere at. Pellentesque convallis bibendum lacus, sed finibus lorem finibus eget. Phasellus in massa non felis mollis molestie at nec arcu. In faucibus commodo elit sed suscipit. Maecenas magna felis, cursus ut viverra a, porttitor quis lacus. Proin iaculis mi et gravida consectetur. Vestibulum tortor dui, cursus at ullamcorper at, accumsan id dolor. Nam commodo eu felis vel vehicula. Donec urna augue, semper et bibendum et, ullamcorper vitae est. Aenean mollis urna non purus facilisis, at semper mauris porta.\\n```Integer ac accumsan sapien, in efficitur augue. Nunc porttitor erat eu dui commodo posuere. Cras lobortis turpis felis, eget finibus ipsum euismod nec. Vestibulum malesuada turpis eu porta euismod. In viverra, ligula at vulputate blandit, velit odio congue neque, vel sollicitudin mauris eros at nunc. Ut facilisis posuere ligula sed commodo. Integer in convallis justo, auctor mollis est. Praesent auctor, ex ac lobortis tincidunt, mauris ligula auctor nisl, vel consequat leo augue in mi. Phasellus posuere auctor massa ut vestibulum. Praesent varius enim leo, et tristique velit suscipit a. Nulla quis vulputate nisi, id congue justo. Sed risus dolor, laoreet at posuere id, commodo vel nisi.```\\nInterdum et malesuada fames ac ante ipsum primis in faucibus. Proin pretium pulvinar ex vitae accumsan. Fusce commodo erat nec elit ullamcorper, a volutpat dolor aliquam. Proin nec lectus eu eros pretium hendrerit. Nullam lobortis eleifend augue, ut varius lorem imperdiet vel. Maecenas sed diam suscipit nibh lacinia lobortis. Maecenas ullamcorper tincidunt sollicitudin. Aliquam id mauris commodo, vestibulum arcu ut, tincidunt urna. Fusce quis neque facilisis, congue leo ac, mollis magna. Praesent vehicula ex posuere mauris mattis luctus. Duis imperdiet ligula nec arcu scelerisque, non porta purus iaculis. Donec in purus lorem. In mollis faucibus sem, et efficitur purus lacinia at. Integer sodales metus id velit iaculis, vel vestibulum sapien eleifend. Fusce at tellus auctor justo rhoncus malesuada. Morbi accumsan venenatis ligula sed pulvinar."