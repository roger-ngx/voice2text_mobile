import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import LottieView from 'lottie-react-native';
import { Icon } from 'react-native-elements';
import DocumentPicker from 'react-native-document-picker';

const AudioUploadingView = () => {

    const pickFile = async() => {
        try{
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.audio]
            });
            console.log(res);
        }catch(ex){
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            }
            console.log(ex);
        }
    };

    return (<View style={{alignItems: 'center'}}>
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
        marginVertical: 24,
    },
    buttonTxt: {
        color: 'white',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    }
})

export default AudioUploadingView;