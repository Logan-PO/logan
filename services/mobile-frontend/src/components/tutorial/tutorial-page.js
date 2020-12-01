import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View } from 'react-native';
import { Button, Divider } from 'react-native-paper';

const TutorialPage = ({ children, onPageChange, previousTitle, previousPage, nextTitle, nextPage }) => (
    <View style={{ height: '100%' }}>
        <ScrollView>
            <View style={{ alignItems: 'center', padding: 16 }}>{children}</View>
        </ScrollView>
        <Divider />
        <View style={{ flexDirection: 'row', padding: 16 }}>
            {previousTitle && (
                <Button mode="contained" onPress={() => onPageChange(previousPage)}>
                    {previousTitle}
                </Button>
            )}
            <View style={{ flex: 1 }} />
            {nextTitle && (
                <Button mode="contained" onPress={() => onPageChange(nextPage)}>
                    {nextTitle}
                </Button>
            )}
        </View>
    </View>
);

TutorialPage.propTypes = {
    children: PropTypes.node,
    onPageChange: PropTypes.func,
    previousTitle: PropTypes.string,
    previousPage: PropTypes.func,
    nextTitle: PropTypes.string,
    nextPage: PropTypes.func,
};

export default TutorialPage;
