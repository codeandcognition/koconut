//@flow
import React, {Component} from 'react';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';


class LoadingView extends Component {

  componentDidMount() {
     // this.props.loadDisplay();
  }

  render() {

    let loadStyle = {
      height: "70vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }

    return (
        <div style={loadStyle}>
          <CircularProgress size={100} thickness={5}  />
        </div>
    );
  }
}

export default LoadingView;