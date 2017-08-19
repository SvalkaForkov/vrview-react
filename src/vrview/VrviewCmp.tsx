//todo: buscar e incluir tipos (@type) para vrview
//todo: quitar # en div id de vrview
//todo: is_debug prop = true/false
//todo: eliminar manejadores de eventos para evitar perdidas de memoria (vrview.on)

import * as React from 'react';
import * as VRView from  './vrview.js';
import {ISceneConfig} from './IVrviewConfig';

export default class Vrview extends React.Component<{config: ISceneConfig}, {}> {

  //todo: definir tipo/interfaz para vrview
  vrview: any;

  componentDidMount() {
    const onVrViewLoad = () => {

      //todo: (refactor) (probar en nueva branch) esto debería estar en el estado y funcionar como single source of true para subcomponentes (hotspots)
      this.vrview = new VRView.Player('vrview', this.props.config);
      const hotspotsChildrenComponents = this.props.children;

      React.Children.map( hotspotsChildrenComponents, (hotspotChildComponent) => {

        const hotspot = (hotspotChildComponent as any).props.data;
        const newScene = (hotspotChildComponent as any).props.newScene;
        console.log('newScene', newScene);

        this.vrview.on('ready', () => {
          console.log('adding hotspot', hotspot);
          this.vrview.addHotspot(hotspot.name, {
            pitch: hotspot.pitch,
            yaw: hotspot.yaw,
            radius: hotspot.radius,
            distance: hotspot.distance
          })
        }); //on

        this.vrview.on('click', (event: {id: string}) => {
          if ( (event.id === hotspot.name) && newScene ) {
            this.vrview.setContent({
              image: newScene.image,
              is_stereo: newScene.is_stereo
            });
          }
          if( (event.id === hotspot.name) && !newScene) {
            alert('Undefined destination scene');
          }
        }); //on

      }); //map

    };

    window.addEventListener('load', onVrViewLoad);

  }

  // shouldComponentUpdate(){
  //   return false;
  // }

  componentWillReceiveProps(){
    console.log('component will recive props', this.props.config);
  }

  componentDidUpdate() {
    console.log('component did update', this.props.config);
    this.vrview.setContent(this.props.config);
  }

  render() {
    return (
      <div id='vrview'>
        {this.props.children}
      </div>
    );
  }
}