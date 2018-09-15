import React, {Component} from 'react';
import {View, PanResponder, Animated} from 'react-native';


class Deck extends Component {
    constructor(props){
        super(props);
        //panresponder will track the gesture or the movement of 
        //users finger on card element, the co-ordinates
        //can then be passed to the animated module, which will actually 
        //cause the movement of the cards element

        
        const position = new Animated.ValueXY();
        const panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gesture) => {
                position.setValue({x:gesture.dx,y:gesture.dy})
            },
            onPanResponderRelease: ()=> {}
        }); 
        this.state = {panResponder, position};

    }
    renderCards(){
        return this.props.data.map(item =>{
            return this.props.renderCard(item)
        })
    }

    render(){
        return(
            <Animated.View 
              style = {this.state.position.getLayout()}
              {...this.state.panResponder.panHandlers}>
                {this.renderCards()}
            </Animated.View>
        );
    }
}


export default Deck;