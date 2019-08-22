import Reactotron          from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';
import sagaPlugin          from 'reactotron-redux-saga';

const tron = Reactotron.configure({ host: '10.0.0.91' })
  .use(reactotronRedux())
  .use(sagaPlugin())
  .connect();

tron.clear();

console.tron = tron;

export default tron;