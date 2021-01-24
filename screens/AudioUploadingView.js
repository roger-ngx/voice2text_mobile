import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import LottieView from 'lottie-react-native';
import { Icon } from 'react-native-elements';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import { map } from 'lodash';

const SERVER_URL = 'http://183.96.253.147:8052';

const AudioUploadingView = () => {

    const [ texts, setTexts ] = useState([]);
    const [ uploadingStatus, setUploadingStatus] = useState('');

    const uploadBegin = (response) => {
        const jobId = response.jobId;
        console.log('UPLOAD HAS BEGUN! JobId: ' + jobId);
    };

    const uploadProgress = (response) => {
        const percentage = Math.floor((response.totalBytesSent/response.totalBytesExpectedToSend) * 100);
        console.log('UPLOAD IS ' + percentage + '% DONE!');
        setUploadingStatus(percentage + '%');
    };

    const pickFile = async() => {
        try{
            const file = await DocumentPicker.pick({
                type: [DocumentPicker.types.audio]
            });

            setTimeout(() => {
                console.log(file.uri);
                const uri = file.uri;
                if(uri){
                    const split = uri.split('/');
                    const name = split.pop();
                    const inbox = split.pop();
                    const realPath = `${RNFS.TemporaryDirectoryPath}${inbox}/${name}`;
                    console.log(realPath);

                    const files = [{
                        name: 'file',
                        filename: file.name,
                        filepath: realPath,
                        filetype: file.type
                    }];

                    RNFS.uploadFiles({
                        toUrl: SERVER_URL + '/upload/file',
                        files: files,
                        method: 'POST',
                        // headers: {
                        //   'Accept': 'application/json',
                        // },
                        fields: {
                          'name': new Date().getTime().toString(),
                        },
                        begin: uploadBegin,
                        progress: uploadProgress
                    })
                    .promise
                    .then((response) => {
                        if (response.statusCode == 200) {
                            const data = JSON.parse(response.body);
                            setTexts(data.transcription);
                        } else {
                            console.log('SERVER ERROR');
                        }
                    })
                    .catch((err) => {
                        if(err.description === "cancelled") {
                        // cancelled by user
                        }
                        console.log(err);
                    });
                }
            }, 1000);

        }catch(err){
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            }
            console.log(err);
        }
    };

    return (<ScrollView contentContainerStyle={{alignItems: 'center'}}>
        <LottieView
            source={require('lotties/home.json')}
            style={{height: 160, width: 160, aspectRatio: 2}}
            autoPlay
            loop
        />
        <Text style={{fontSize: 24, fontWeight: 'bold', color: 'purple', marginBottom: 12}}>InstaUploader</Text>
        
        <TouchableOpacity
            style={styles.button}
            onPress={pickFile}
        >
            <Icon
                name='backup'
                color='white'
                // size={16}
                style={{marginRight: 8}}
            />
            <Text style={styles.buttonTxt}>pick a file</Text>
        </TouchableOpacity>
        {
            map(texts, text => <Text key={text}>{text}</Text>)
        }
    </ScrollView>)
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
        marginVertical: 24,
    },
    buttonTxt: {
        color: 'white',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    }
})

export default AudioUploadingView;