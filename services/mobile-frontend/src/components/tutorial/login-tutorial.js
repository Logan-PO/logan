import React from 'react';
import { Image } from 'react-native';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Typography from '../shared/typography';

class LoginTutorial extends React.Component {
    render() {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View>
                        <Typography variant="h3">Login Screen</Typography>
                    </View>
                    <View style={{ width: '90%', height: '90%' }}>
                        <Image
                            style={{ width: '100%', height: '100%' }}
                            source={require('./images/login_screen.jpg')}
                        />
                    </View>
                    <View>
                        <Typography variant="body">
                            This is test, a;okjdhf;lakhf;lokaw;okhfd;dkjfa';skjfl;akjdf;lkajd';lkj;ja;slkfjals;dkj
                            ;slkdfjgl;skjg;lksjfg;lksjdf;lgkjsl;fg;jlajkdshflakjhdflkajhdfklajhsdlkfjhasldfjhljalkjdfhklajhdfklajhsdfk
                            lakjhdflkajhdflkahdslkjhalkshjdf;lkajshfdlkajshfvlkjahvja;sjdbfnklajvblkjasbv ljasbhv
                            as;lkklhavk;jhask;jvblaksjvblkjasbvkjbasvkljbaskljdbkaljshfg;lkoashngbasVasd'p'as;asdfjb
                        </Typography>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

/*
<View>
                    <Typography variant="h3">Login Screen</Typography>
                </View>
                <View style={{ width: '90%', height: '90%' }}>
                    <Image style={{ width: '100%', height: '100%' }} source={require('./images/login_screen.jpg')} />
                </View>
                <View>
                    <Typography variant="body">This is test text</Typography>
                </View>
 */

export default LoginTutorial;
