// @flow
import React, {Component} from 'react';

export default class BreadCrumbs extends Component {
  render() {
    return (<div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="#">B</a></li>
          <li className="breadcrumb-item"><a href="#">R</a></li>
          <li className="breadcrumb-item"><a href="#">E</a></li>
          <li className="breadcrumb-item"><a href="#">A</a></li>
          <li className="breadcrumb-item active" aria-current="page">D</li>
        </ol>
      </nav></div>)
  }
}

