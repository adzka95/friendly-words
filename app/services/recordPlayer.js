import Sound from "react-native-sound";

export const playRecord = (record1, record2, record3) => {
    if (record1 != '') {
        const sound = new Sound(record1, null, (error) => {
            if (error) {
                console.log('failed to load the sound', error);
                playRecord(record2, record3, '')
            } else {
                this.setTimeout(() => {
                    playRecord(record2, record3, '')
                }, sound.getDuration() * 1000);
                sound.play();
            }
        });
    }
};