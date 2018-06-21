//@flow
import React, {Component} from 'react';
import CircularProgress from 'material-ui/CircularProgress';


class LoadingView extends Component {
  render() {
    return(
        <CircularProgress />
    );
  }
}

export default LoadingView;