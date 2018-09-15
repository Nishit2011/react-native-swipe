import React, {Component} from 'react';
import {View, PanResponder, Animated, Dimensions} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

//SWIPE-THRESHOLD TELLS ABOUT THE MINIMUM AMOUNT OF DISTANCE NEEDED TO
//drag the card
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;
class Deck extends Component {
    constructor(props){
        super(props);
        //panresponder will track the gesture or the movement of 
        //users finger on card element, the co-ordinates
        //can then be passed to the animated module, which will actually 
        //cause the movement of the cards element

        
        const position = new Animated.ValueXY();
        const panResponder = PanResponder.create({
            //activates panresponder
            onStartShouldSetPanResponder: () => true,
            //tracks the hand movement on the device
            onPanResponderMove: (event, gesture) => {
                position.setValue({x:gesture.dx,y:gesture.dy})
            },
            //tells what to do when the user release/removes his touch from the device
            onPanResponderRelease: (event,gesture)=> {
                if(gesture.dx > SWIPE_THRESHOLD){
                   this.forceSwipeRight();
                }else if(gesture.dx < -SWIPE_THRESHOLD){
                    this.forceSwipeLeft();
                }else{
                    this.resetPosition();
                }
                
            }
        }); 
        this.state = {panResponder, position};

    }

    forceSwipeRight(){
        Animated.timing(this.state.position, {
            toValue: {x:SCREEN_WIDTH,y:0},
            duration: SWIPE_OUT_DURATION
        }).start();
    }
    forceSwipeLeft(){
        Animated.timing(this.state.position, {
            toValue: {x: -SCREEN_WIDTH, y:0},
            duration: SWIPE_OUT_DURATION
        }).start();
    }

    resetPosition(){
        Animated.spring(this.state.position, {
            toValue:{x:0,y:0}
        }).start();
    }

    getCardStyle(){
        const {position} = this.state;
        const rotate = position.x.interpolate({
            inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
            outputRange:['-120deg','0deg','120deg']
        })
        return {
            ...position.getLayout(),
            transform: [{rotate   }]
        }
    }
    renderCards(){
        return this.props.data.map((item,index) =>{
            if(index===0){
                return (
                    <Animated.View
                    key={item.id}
                    style = {this.getCardStyle()}
                    {...this.state.panResponder.panHandlers}
                    >
                    {this.props.renderCard(item)}
                    </Animated.View>
                )
            }

            return this.props.renderCard(item)
        })
    }

    render(){
        return(

            <Animated.View>
            {this.renderCards()}
            </Animated.View>
        );
    }
}


export default Deck;