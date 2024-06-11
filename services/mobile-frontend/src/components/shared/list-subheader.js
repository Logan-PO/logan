import _ from 'lodash';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BreadcrumbsLike from './breadcrumbs-like';
import Typography from './typography';

const ss = StyleSheet.create({
    root: {
        paddingHorizontal: 16,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    listHeader: {
        flex: 1,
        alignItems: 'center',
    },
});

const ListSubheader = ({ items = [], colors = [], styles = {}, breadcrumbsStyles = {} }) => (
    <View style={_.merge(ss.root, styles.root)}>
        <BreadcrumbsLike
            styles={_.merge({ root: ss.listHeader }, breadcrumbsStyles)}
            sections={items}
            colors={colors}
            separator={(color, sectionContent, index) => (
                <Typography key={`s${index}`} color={color}>
                    <Icon name="chevron-right" style={{ fontSize: 22 }} />
                </Typography>
            )}
        />
    </View>
);

ListSubheader.propTypes = {
    items: PropTypes.arrayOf(PropTypes.string).isRequired,
    colors: PropTypes.arrayOf(PropTypes.string).isRequired,
    styles: PropTypes.exact({
        root: PropTypes.object,
    }),
    breadcrumbsStyles: PropTypes.object,
};

export default ListSubheader;
