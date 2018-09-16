import React, {Component} from 'react';
import {View, PanResponder, Animated, Dimensions} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

//SWIPE-THRESHOLD TELLS ABOUT THE MINIMUM AMOUNT OF DISTANCE NEEDED TO
//drag the card
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;
class Deck extends Component {
    static defaultProps = {
        onSwipeRight: ()=>{},
        onSwipeLeft: ()=>{}
    }
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
                   this.forceSwipe('right');
                }else if(gesture.dx < -SWIPE_THRESHOLD){
                    this.forceSwipe('left');
                }else{
                    this.resetPosition();
                }
                
            }
        }); 
        this.state = {panResponder, position};

    }

    
    
    forceSwipe(direction){
        const x = direction === "right" ? SCREEN_WIDTH : -SCREEN_WIDTH;
        Animated.timing(this.state.position, {
            toValue: {x, y:0},
            duration: SWIPE_OUT_DURATION
        }).start(()=> this.onSwipeComplete(direction));
    }

    onSwipeComplete(direction){
        const {onSwipeLeft, onSwipeRight,data} = this.props;
        const item = data[this.state.index];
        direction === "right" ? onSwipeRight(item) : onSwipeLeft(item);
        //will set the position of next card after the fiorst card
        //has been swiped away to zero and
        this.state.position.setValue({x:0, y:0})
        this.setState({index:this.state.index + 1});
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
        return this.props.data.map((item,i) =>{
            if(i<this.state.index){return null}
            if(i===this.state.index){
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