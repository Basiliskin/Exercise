import React, {Component} from 'react';

import { 
    ListGroup, ListGroupItem ,
    Form, FormGroup, Label, Input,
    Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';

import {bindActionCreators} from 'redux';
import {connect} from "react-redux";

import {actions,ActionMode} from './store/actions/locationActions.jsx';

class LocationView extends Component {

    constructor(props)
    {
        super(props);
        this.state = {
            order:false,
            group:false,
            groupBy:undefined,
            dropdownOpen:undefined
        }
    }
    componentDidMount()
    {
        this.props.selectItem({
            type:ActionMode,
            value:undefined
        });
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
    onSelect(event,Name)
    {
        event.preventDefault();
        this.props.selectItem({
            type:ActionMode,
            value:Name
        },`/${ActionMode}/${Name}`);
    }
    toggle() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }
    onChange(event,name,value)
    {
        this.setState({[name]: value || !this.state[name]});
    }
    render()
    {
        const onChange = this.onChange.bind(this);
        const {category} = this.props;
        let location = this.props[ActionMode];
        location = location || [];
        const onSelect = this.onSelect.bind(this);

        const {order,group,groupBy} = this.state;
        if(order)
        {
            location.sort(function(a,b){
                var nameA = a.Name.toUpperCase(); 
                var nameB = b.Name.toUpperCase(); 
                return nameA < nameB ? -1 : (nameA > nameB ? 1  :0);
            });
        }
        location = location.filter(item => item.Category.findIndex((name)=> !groupBy || name===groupBy)>=0);        
        const getList = (list) =>
        {
            return (
                <ListGroup >
                {
                    list.map(function(loc,i){
                        return (                            
                            <ListGroupItem key={i} action onClick={(e)=>onSelect(e,loc.Name)}>
                                {loc.Name}
                            </ListGroupItem>
                        )
                    })
                }
                </ListGroup>
            );
        }
        const locationList = group ?
            (
                <div>
                {
                    category.map(function(cat,j){
                        const list = location.filter(item => item.Category.findIndex((name)=> name===cat.Name)>=0);
                        return list.length ? (
                            <div key={j}>
                                <strong>{cat.Name}</strong>
                                { getList(list) }
                            </div>
                        ) : <div key={j}/>
                    })
                }
                </div>
            )
            : (
                <div>{ getList(location) }</div>
            );
        const categoryList  = (
            <DropdownMenu>
                {
                    groupBy ? (<DropdownItem onClick={(e)=> onChange(e,'groupBy') }>All</DropdownItem>) : <span/>
                }
                {
					category.map(function(cat,j){
                        const category = cat.Name;
                        return <DropdownItem key={j} onClick={(e)=> onChange(e,'groupBy',category) }>{category}</DropdownItem>
                    })
                }
            </DropdownMenu>
        );
        return (
            <div>
                <div style={{ display:'flex',flexFlow:'row',justifyContent: 'center' }}>
                    <Form>
                        <FormGroup check inline>
                            <Label check>
                                <Input type="checkbox" checked={order} onChange={(e) => onChange(e,'order')}/>Order
                            </Label>
                        </FormGroup>
                        <FormGroup check inline>
                            <Label check>
                                <Input type="checkbox"  checked={group} onChange={(e) => onChange(e,'group')}/>Group
                            </Label>
                        </FormGroup>
                        <FormGroup check inline>
                        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle.bind(this)}>
                            <DropdownToggle caret>
                                { groupBy || 'Group By'}
                            </DropdownToggle>
                            {categoryList}
                        </Dropdown>
                        </FormGroup>
                    </Form>
                </div>
                {locationList}
            </div>
        );
    }
}


const mapStateToProps = (state) => ({
    category: state.category,
    location: state.location
});
  
const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
});
  

export default connect(mapStateToProps, mapDispatchToProps,null,{ withRef: true })(LocationView);