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

const FANFARE = [ 'fanfare1.mp3', 'fanfare2.mp3', 'fanfare3.mp3'];

export class SummaryScreen extends Component {
    constructor(props){
        super(props);
    }

    render(){
        let fanfare = _.sample(FANFARE);
        playRecord ( 'konieczadania.m4a',fanfare);

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
