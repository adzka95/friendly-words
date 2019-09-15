import React, {Component} from "react";
import {JumboHeader} from "../components/ui/Header";
import {PlayButton} from "../components/ui/borderedButton/BorderedButton";
import CapriolaText from "../components/ui/CapriolaText";
import {Layout} from "./Game";
import {Image, View} from "glamorous-native";
import * as constants from "../../android/app/src/main/res/constantStrings";
import {moderateScale} from "../services/scalign";
import {playRecord} from "../services/recordPlayer";
import _ from "lodash";
import {speak} from "../services/speaker";

const FANFARE = [ 'fanfare1.mp3', 'fanfare2.mp3', 'fanfare3.mp3'];
const BRAVO = [ 'brawo1.mp3', 'brawo2.mp3', 'brawo3.mp3'];
const ENDOFTASK = [ 'konieczadania1.mp3', 'konieczadania2.mp3', 'konieczadania3.mp3'];

export class SummaryScreen extends Component {
    constructor(props){
        super(props);
    }

    render(){
        let fanfare = _.sample(FANFARE);
        let bravo = _.sample(BRAVO);
        let endOfTask = _.sample(ENDOFTASK);
        this.props.shouldReadReward
            ? playRecord (endOfTask, bravo, fanfare)
            : playRecord (endOfTask, '', '');
        return <Layout>
            <View flex={1} alignItems={"center"} justifyContent={"center"}>
                <Image resizeMode="contain" height={moderateScale(60)} source={require("../assets/images/smile.png")} />
                <JumboHeader>{constants.GameOver}</JumboHeader>
                <PlayButton onPress={this.props.onAccept}/>
                <CapriolaText>{constants.PlayAgain}</CapriolaText>
            </View>
        </Layout>
    }
}
