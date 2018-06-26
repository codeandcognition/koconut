// @flow
import React, {Component} from 'react';

export default class BreadCrumbs extends Component {
  render() {
    let readOrWrite = "";
    if(this.props.readOrWrite === "READ") {
      readOrWrite = "read instructions";
    } else {
      readOrWrite = "write instructions";
    }
    return (<div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="#">{this.props.conceptType}</a></li>
          <li className="breadcrumb-item"><a href="#">{readOrWrite}</a></li>
          <li className="breadcrumb-item active" aria-current="page">{this.props.chosenInstruction ? this.props.chosenInstruction.title : ""}</li>
        </ol>
      </nav></div>)
  }
}

