import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import LottieView from 'lottie-react-native';
import { Icon } from 'react-native-elements';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import { Audio } from 'expo-av';
import RNFS from 'react-native-fs';
import { cloneDeep } from 'lodash';

const SERVER_URL = 'http://183.96.253.147:8052';
// const SERVER_URL = 'http://10.10.20.75:8052';
// const SERVER_URL = 'http://192.168.200.185:8052';

let timer = null;

const AudioUploadingView = () => {

    const [ recordingTime, setRecordingTime ] = useState(0);

    const [recording, setRecording] = React.useState();

    async function startRecording() {
        try {
            console.log('Requesting permissions..');
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
                interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
                staysActiveInBackground: true,
                interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
                shouldDuckAndroid: true,
                playThroughEarpieceAndroid: true
            });
            console.log('Starting recording..');
            const recording = new Audio.Recording();

            const options = cloneDeep(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
            options.ios.extension = '.wav';

            await recording.prepareToRecordAsync(options);

            recording.setOnRecordingStatusUpdate(status => {
                const millis = status.durationMillis;
                const seconds = Math.round(millis/ 1000);
                const minutes = Math.round(seconds / 60);

                setRecordingTime(`${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`);
            });
            recording.setProgressUpdateInterval(1000);

            await recording.startAsync(); 
            setRecording(recording);
            console.log('Recording started');
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    async function stopRecording() {
        console.log('Stopping recording..');
        setRecording(undefined);
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        await requestForText(uri);
        console.log('Recording stopped and stored at', uri);
    }

    // useEffect(() => {
    //     if(recording){
    //         setRecordingTime(0);

    //         checkPermissionAndoRecord();

    //         timer = setInterval(() => {
    //             setRecordingTime(recordingTime => recordingTime + 1);
    //         }, 1000);
    //     }else{
    //         timer && clearInterval(timer);
    //     }

    //     // return timer & clearInterval(timer);

    // }, [recording]);

    const checkPermissionAndoRecord = () => {
        const micPermission = Platform.OS === 'ios' ?  PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.MICROPHONE;
        check(micPermission).then(result => {
            if(result !== RESULTS.GRANTED){
                request(micPermission).then(result => {
                    if(result === RESULTS.GRANTED){
                        //do record
                        console.log('already permitted', 'do record');
                    }
                });
            }else{
                //do record
                console.log('permitted', 'do record');
            }
        });
    };

    const uploadBegin = (response) => {
        const jobId = response.jobId;
        console.log('UPLOAD HAS BEGUN! JobId: ' + jobId);
    };

    const uploadProgress = (response) => {
        const percentage = Math.floor((response.totalBytesSent/response.totalBytesExpectedToSend) * 100);
        console.log('UPLOAD IS ' + percentage + '% DONE!');
    };


    const requestForText = async(uri) => {
        try{
            if(uri){
                const response = await fetch(uri);
                const blob = await response.blob();

                const formData = new FormData();
                formData.append('file', blob.data);
                formData.append('name', new Date().getTime().toString());

                fetch(SERVER_URL + '/upload/file', {
                    method: 'POST',
                    mode: 'cors',
                    body: formData
                })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                })
                .catch(console.log);
            }
        }catch(err){
            console.log(err);
        }
    };

    return (<View style={{alignItems: 'center'}}>
        <LottieView
            source={require('lotties/home.json')}
            style={{height: 160, width: 160, aspectRatio: 2}}
            autoPlay
            loop
        />
        <Text style={{fontSize: 24, fontWeight: 'bold', color: 'purple', marginBottom: 12}}>InstaPlayer</Text>
        <Text style={{fontSize: 16, marginBottom: 4}}>
            {recordingTime}
        </Text>
        
        {
            !recording &&
            <TouchableOpacity
                style={styles.button}
                onPress={startRecording}
            >
                <Icon
                    name='mic'
                    color='white'
                    size={16}
                    style={{marginRight: 8}}
                />
                <Text style={styles.buttonTxt}>record</Text>
            </TouchableOpacity>
        }

        {
            recording &&
            <TouchableOpacity
                style={styles.buttonSecondary}
                onPress={stopRecording}
            >
                <Icon
                    name='stop-circle'
                    color='purple'
                    size={16}
                    style={{marginRight: 8}}
                />
                <Text style={styles.buttonSecondaryTxt}>stop</Text>
            </TouchableOpacity>
        }

        <Text  style={{fontSize: 16, marginBottom: 4, marginTop: 24}}>00:00:00 / 00:00:00</Text>
        <TouchableOpacity style={styles.button}>
            <Icon
                name='play-arrow'
                color='white'
                size={16}
                style={{marginRight: 8}}
            />
            <Text style={styles.buttonTxt}>play</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
            <Icon
                name='pause'
                color='white'
                size={16}
                style={{marginRight: 8}}
            />
            <Text style={styles.buttonTxt}>pause</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSecondary}>
            <Icon
                name='stop-circle'
                color='purple'
                size={16}
                style={{marginRight: 8}}
            />
            <Text style={styles.buttonSecondaryTxt}>stop</Text>
        </TouchableOpacity>
    </View>)
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'purple',
        padding: 16,
        width: '80%',
        alignItems: 'center',
        borderRadius: 4,
        marginVertical: 5,
    },
    buttonTxt: {
        color: 'white',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    buttonSecondary: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'white',
        padding: 16,
        width: '80%',
        alignItems: 'center',
        borderRadius: 4,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: 'purple' 
    },
    buttonSecondaryTxt: {
        color: 'purple',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
})

export default AudioUploadingView;