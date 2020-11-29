import React from 'react';
import { View, Dimensions, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Typography from '../shared/typography';

class OverviewTutorial extends React.Component {
    render() {
        let scale = 0.8;
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ScrollView
                    contentContainerStyle={{
                        height: Dimensions.get('screen').height,
                        width: Dimensions.get('screen').width,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <View>
                        <Typography variant="h3">Overview</Typography>
                    </View>
                    <View
                        style={{
                            width: Dimensions.get('screen').width * scale,
                            height: Dimensions.get('screen').height * scale,
                        }}
                    >
                        <Image
                            style={{
                                width: Dimensions.get('screen').width * scale,
                                height: Dimensions.get('screen').height * scale,
                            }}
                            source={require('./images/overview.jpg')}
                        />
                    </View>
                    <View>
                        <Typography style={{ textAlign: 'center' }} variant="body">
                            {'\n'}The overview page shows all classes, assignments and tasks in one convenient place.
                            The page is read only, as the other screens are where you can edit your schedule. {'\n'}
                        </Typography>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

export default OverviewTutorial;
