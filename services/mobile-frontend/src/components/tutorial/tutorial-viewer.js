import React from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-native-safe-area-context';
import ViewController from '../shared/view-controller';
import LoginTutorial from './tutorial-pages/login-tutorial';

class TutorialViewer extends React.Component {
    constructor(props) {
        super(props);

        this.onPageChange = this.onPageChange.bind(this);

        this.state = {
            currentPage: LoginTutorial,
        };
    }

    onPageChange(nextPage) {
        if (nextPage) {
            this.setState({ currentPage: nextPage });
        } else {
            this.props.navigation.goBack();
        }
    }

    render() {
        const CurrentPage = this.state.currentPage;

        return (
            <ViewController disableHeader statusBarStyle="dark">
                <SafeAreaView>
                    <CurrentPage onPageChange={this.onPageChange} />
                </SafeAreaView>
            </ViewController>
        );
    }
}

TutorialViewer.propTypes = {
    navigation: PropTypes.object,
};

export default TutorialViewer;
