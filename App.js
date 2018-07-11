import React from 'react';
import Game from "./app/containers/Game"
import {StackNavigator} from "react-navigation";
import {Text, View} from "react-native";
import _ from "lodash";
import {AdamConfig, defaultConfig, FrycekConfig, FrycekTestConfig, KacperConfig} from "./TEMP_CONFIGS"
import MainScreen from "./app/containers/MainScreen";
import {readActiveConfig, readConfigs} from "./app/services/db/configs";
import {ModeTypes} from "./app/services/db/format";
import ConfigProvider from "./app/containers/ConfigProvider";
import ConfigConsumer from "./app/containers/ConfigConsumer";
import Analytics from "appcenter-analytics"
import SplashScreen from "./app/containers/SplashScreen";

const configFromDbToGameScreen = (config) => ({
    ...config,
    isTextForPicture: config.showPicturesLabels,
    materials: config.materials.map(material => ({
        name: material.word.name,
        images: material.images,
        isInTestMode: material.isInTestMode,
        isInLearningMode: material.isInLearningMode,
    })),
});

function prepareLevels(materials, repetitions, optionsNumber) {
    let levels = _.shuffle(_.flatMap(materials, material =>
        _.map(_.range(repetitions),
            () => _.shuffle(_.concat(_.sampleSize(_.reject(materials, material), optionsNumber - 1), {
                name: material.name,
                images: material.images,
                isCorrectAnswer: true
            })))));

    levels = _.map(levels, level => _.map(level, material => ({...material, image: _.sample(material.images)})));
    return _(levels);
}

const GameScreen = ({navigation}) => {
    return (
        <ConfigConsumer>
            {(config, mode) => {
                const isTestMode = mode === ModeTypes.test

                const materials = isTestMode ? _.filter(config.materials, 'isInTestMode') : config.materials,
                    repetitions = isTestMode ? config.testConfig.numberOfRepetitions : config.numberOfRepetitions;

                return <Game
                    levels={prepareLevels(materials, repetitions, config.picturesNumber)}
                    command={config.commandText}
                    textRewards={config.textRewards}
                    shouldShowPicturesLabels={config.isTextForPicture}
                    shouldReadReward={config.isReadingRewards}
                    shouldReadCommand={config.isReadingCommands}
                    showHintAfter={config.showHintAfter}
                    timeForAnswer={config.testConfig.timeForAnswer}
                    isTestMode={isTestMode}
                    goToMainScreen={() => navigation.goBack()}
                />
            }
            }
        </ConfigConsumer>
    )
};


const AppNavigator = StackNavigator(
    {
        Home: {screen: MainScreen},
        Splash: {screen: SplashScreen},
        Game: {screen: GameScreen}
    },
    {
        headerMode: "none",
        initialRouteName: "Splash"
    });


export default class App extends React.Component {
    state = {
        fontLoaded: false,
    };

    async loadConfig() {
        const {id, mode = ModeTypes.learning} = await readActiveConfig()
        console.log("Active config id: ", id, "in mode:", mode === ModeTypes.learning ? "learning" : "test")

        const configs = await readConfigs()

        const activeConfig = configs.find(config => config.id === id) || defaultConfig;

        console.log("Active config:", activeConfig)
        return {
            config: activeConfig.config,
            mode: mode,
        }
    }

    async loadAssets() {

        await Promise.resolve()

        console.log("Loaded all assets")
    }

    async componentDidMount() {
        Analytics.trackEvent("App loaded");

        await this.loadAssets();
        const {config, mode} = await this.loadConfig();
        this.setState({
            assetsLoaded: true,
            config: configFromDbToGameScreen(config),
            mode
        });
    }

    render() {
        return !this.state.assetsLoaded ? <Text>Loading</Text> : (
            <ConfigProvider config={this.state.config} mode={this.state.mode}>
                <AppNavigator/>
            </ConfigProvider>
        );
    }
}
