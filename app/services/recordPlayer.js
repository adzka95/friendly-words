import Sound from "react-native-sound";

export const playRecord = (record1, record2) => {
    if (record1 != '') {
        const sound = new Sound(record1, null, (error) => {
            if (error) {
                console.log('failed to load the sound', error);
            } else {
                this.setTimeout(() => {
                    playRecord(record2, '')
                }, sound.getDuration() * 1000);
                sound.play();
            }
        });
    }
};