import React, {Component} from 'react';

import { ListGroup, ListGroupItem } from 'reactstrap';

import {bindActionCreators} from 'redux';
import {connect} from "react-redux";

import {actions,ActionMode} from './store/actions/categoryActions.jsx';


class CategoryView extends Component {
    componentDidMount()
    {
        this.props.selectItem({
            type:ActionMode,
            value:undefined
        });
    }
    onSelect(event,Name)
    {
        event.preventDefault();
        this.props.selectItem({
            type:ActionMode,
            value:Name
        },`/${ActionMode}/${Name}`);
    }
    handleAction(cmd)
    {
        //console.log('handleAction',cmd);
        switch(cmd)
        {
            case 'Add':            
                this.props.selectItem({
                    type:ActionMode,
                    value:'New'
                },`/${ActionMode}/New`);
                break;
            default:
                break;
        }
    }
    render()
    {
        const category = this.props[ActionMode];
        const onSelect = this.onSelect.bind(this);
        const categoryList = (
            <ListGroup>
                {
					category.map(function(cat,j){
                        return (                            
                            <ListGroupItem key={j} action onClick={(e)=>onSelect(e,cat.Name)}>
                                {cat.Name}
                            </ListGroupItem>
                        )
                    })
                }
            </ListGroup>
        );
        return (
            <div>
                {categoryList}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    category: state.category
});
  
const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
});
  

export default connect(mapStateToProps, mapDispatchToProps,null,{ withRef: true })(CategoryView);