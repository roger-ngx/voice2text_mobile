import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import LottieView from 'lottie-react-native';
import { Icon } from 'react-native-elements';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

let timer = null;

const AudioUploadingView = () => {

    const [ recordingTime, setRecordingTime ] = useState(0);
    const [ isRecording, setRecording ] = useState();

    useEffect(() => {
        if(isRecording){
            setRecordingTime(0);

            checkPermissionAndoRecord();

            timer = setInterval(() => {
                setRecordingTime(recordingTime => recordingTime + 1);
            }, 1000);
        }else{
            timer && clearInterval(timer);
        }

        // return timer & clearInterval(timer);

    }, [isRecording]);

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

    return (<View style={{alignItems: 'center'}}>
        <LottieView
            source={require('lotties/home.json')}
            style={{height: 160, width: 160, aspectRatio: 2}}
            autoPlay
            loop
        />
        <Text style={{fontSize: 24, fontWeight: 'bold', color: 'purple', marginBottom: 12}}>InstaPlayer</Text>
        <Text style={{fontSize: 16, marginBottom: 4}}>
            {`${('0' + Math.floor(recordingTime/60)).slice(-2)}:${('0' + recordingTime%60).slice(-2)}`}
        </Text>
        
        {
            !isRecording &&
            <TouchableOpacity
                style={styles.button}
                onPress={() => setRecording(true)}
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
            isRecording &&
            <TouchableOpacity
                style={styles.buttonSecondary}
                onPress={() => setRecording(false)}
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