import React, {Component} from 'react';

import {bindActionCreators} from 'redux';
import {connect} from "react-redux";

import {actions,ActionMode} from './store/actions/categoryActions.jsx';

import { InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';

class CategoryItem extends Component {
    constructor(props)
    {
        super(props);
        const Name = props.match.params[ActionMode] || '';
        const found = props.category.find(function(element) {
            return element.Name === Name;
        }); 

		this.state = {
            value:found ? Name : ''
        };
    }
    Validate(set)
    {
        let {value} = this.state;
        //console.log(Name,Category,Coordinates,Address);
        if(set)
        {
            value = set.value;
            this.setState(set);
        }
        

        if(value)
            this.props.selectItem({
                type:ActionMode,
                value:value
            });
        else
            this.props.selectItem();
    }
    componentDidMount()
    {
        this.Validate();
    }
    onChange(event)
    {
        this.Validate({value: event.target.value});
    }
    handleAction(cmd)
    {
        const {value} = this.state;
        if(cmd==='Save')
        {
            this.props.actions.newCategory(value);
        }
        else
        {
            this.props.actions.deleteCategory(value);
        }
        this.props.history.goBack();
        //console.log('handleAction',cmd,value,this.props);
    }
    render()
    {
        const {value} = this.state;   
        const onChange = this.onChange.bind(this);
        return (
            <div>
                <InputGroup >
                    <InputGroupAddon addonType="prepend">
                        Category Name
                    </InputGroupAddon>
                    <Input placeholder="Name" ref={(mod)=> this.value = mod} value={value}
                        onChange={onChange}
                    />
                </InputGroup>
            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    category: state.category
});
  
const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
});
  
export default connect(mapStateToProps, mapDispatchToProps,null, { withRef: true })(CategoryItem);