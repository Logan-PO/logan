import React from 'react';
import PropTypes from 'prop-types';
import { View, TextInput } from 'react-native';
import { Colors } from 'react-native-paper';
import SyncComponent from '@logan/fe-shared/components/sync-component';
import { typographyStyles } from '../typography';
import Tag from './tag';

class TagsEditor extends SyncComponent {
    constructor(props) {
        super(props);

        this.deleteTag = this.deleteTag.bind(this);
        this.startNewTag = this.startNewTag.bind(this);
        this.cancelNewTag = this.cancelNewTag.bind(this);
        this.submitNewTag = this.submitNewTag.bind(this);

        this.inputRef = React.createRef();

        this.state = {
            isEditingNewTag: false,
            newTagContent: undefined,
        };
    }

    deleteTag(i) {
        if (this.props.onChange) {
            const clone = [...(this.props.tags || [])];
            clone.splice(i, 1);
            this.props.onChange(clone);
        }
    }

    async startNewTag() {
        await this.setStateSync({
            isEditingNewTag: true,
            newTagContent: '',
        });

        this.inputRef.current.focus();
    }

    cancelNewTag() {
        this.setState({
            isEditingNewTag: false,
            newTagContent: undefined,
        });
    }

    submitNewTag() {
        const newTag = this.state.newTagContent;

        this.setState({
            isEditingNewTag: false,
            newTagContent: undefined,
        });

        if (this.props.onChange) {
            this.props.onChange([...(this.props.tags || []), newTag]);
        }
    }

    render() {
        // eslint-disable-next-line no-unused-vars
        const { tags = [], style = {}, onChange, ...rest } = this.props;

        const newTagClickHandler = this.state.isEditingNewTag ? undefined : this.startNewTag;

        return (
            <View style={{ flexDirection: 'row', ...style }} {...rest}>
                {tags.map((tag, i) => (
                    <Tag variant="body2" key={i} text={tag} onDelete={() => this.deleteTag(i)} />
                ))}
                <Tag
                    key="new"
                    style={{ backgroundColor: 'white', borderWidth: 1, borderColor: Colors.grey500 }}
                    onPress={newTagClickHandler}
                    text={!this.state.isEditingNewTag ? '+' : undefined}
                >
                    {this.state.isEditingNewTag && (
                        <TextInput
                            ref={this.inputRef}
                            style={typographyStyles.body2}
                            value={this.state.newTagContent}
                            placeholder="New tag"
                            onChangeText={text => this.setState({ newTagContent: text })}
                            onBlur={this.cancelNewTag}
                            onSubmitEditing={this.submitNewTag}
                        />
                    )}
                </Tag>
            </View>
        );
    }
}

TagsEditor.propTypes = {
    style: PropTypes.object,
    tags: PropTypes.array,
    onChange: PropTypes.func,
};

export default TagsEditor;
