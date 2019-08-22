import React, { Component                              } from 'react';
import {  StyleSheet                                   } from 'react-native';
import { StackViewStyleInterpolator                    } from 'react-navigation-stack';
import { Router, Overlay, Stack, Scene, Modal, Actions } from 'react-native-router-flux';
import { Provider                                      } from 'react-redux';
import { createStore, applyMiddleware                  } from 'redux';
import createSagaMiddleware                              from 'redux-saga';
import { persistStore, persistReducer                  } from 'redux-persist';
import storage                                           from 'redux-persist/lib/storage';
import { PersistGate                                   } from 'redux-persist/integration/react'

import Home                                              from './src/screen/Home';
import AddCity                                           from './src/screen/Home/addCity';
import Reducers                                          from './src/reducers';
import Root                                              from './src/sagas';
import tron                                              from './ReactoTronConfig';


const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, Reducers)
const sagaMonitor      = tron.createSagaMonitor()
const sagaMiddleware   = createSagaMiddleware({sagaMonitor});
export const store     = createStore(
  persistedReducer, 
  applyMiddleware(sagaMiddleware)
);
const persistor        = persistStore(store);
sagaMiddleware.run(Root);


// Passa a informação de uma tela para outra
const stateHandler = (prevState, newState, action) => {
  // console.tron.log('onStateChange: ACTION:', action);
};

// Verifica a plataforma utilizada
const prefix = Platform.OS === 'android' ? 'Android' : 'IOS';

const transitionConfig = () => ({
  screenInterpolator: StackViewStyleInterpolator.forFadeFromBottomAndroid,
});

const Climate = () => (
  <Router onStateChange={stateHandler} sceneStyle={styles.scene} uriPrefix={prefix}>
    <Overlay key="overlay">
      <Modal key="modal" hideNavBar transitionConfig={transitionConfig}>
        <Stack key="Home" headerLayoutPreset="center" hideNavBar titleStyle={{ alignSelf: 'center' }}>
          <Scene key = "Home"    component  = { Home    }    title = ""  />
          <Scene key = "AddCity" component  = { AddCity } duration={0}   title = ""  />
        </Stack>
      </Modal>
    </Overlay>
  </Router>
);

const styles = StyleSheet.create({
  scene : {
    backgroundColor : '#F5FCFF',
    shadowOpacity   : 1,
    shadowRadius    : 3,
  },
});

export default class App extends Component {
    render() {
      return(
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Climate/>
          </PersistGate>
        </Provider>
      );
    }
};
