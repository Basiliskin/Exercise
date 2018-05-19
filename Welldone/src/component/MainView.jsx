import React, {Component} from 'react';

import { withRouter,Router, Route, Switch,Redirect,Link } from 'react-router-dom'

import {
    Navbar,
    NavbarBrand,
    Button,
    Container, Row, Col
} from 'reactstrap';

import IoIosCopyOutline from 'react-icons/lib/io/ios-copy-outline';
import GoLocation  from 'react-icons/lib/go/location';

import CategoryView from './CategoryView.jsx';
import LocationView from './LocationView.jsx';
import CategoryItem from './CategoryItem.jsx';
import LocationItem from './LocationItem.jsx';


import {connect} from "react-redux";

class MainView extends Component {
    constructor(props)
    {
        super(props);
		this.state = {
            selected:undefined,
            view:'location'
        };
    }
    changeView(view)
    {        
        this.props.history.push(`/${view}`);
    }
    selectItem(item,navigate)
    {
        if(navigate)
        {
            this.props.history.push(navigate);
        }
        else{
            //console.log('selectItem',item);
            this.setState({
                selected: item
            });
        }       
    }
    handleAction(e,cmd)
    {
        e.preventDefault();
        const {selected} = this.state;
        //console.log(cmd,selected);
        if(this.current)
        {
            this.current.getWrappedInstance().handleAction(cmd);
        }
        else{
            this.changeView(selected ? selected.type : 'location');
        }
        
    }
    render() {
        const changeView = this.changeView.bind(this);

        const {selected} = this.state;

        
        //console.log(this.props,this.state);
        
        const view = !selected ? 'location' : selected.type;
        const sharedProps = {
            selectItem : this.selectItem.bind(this),
            ref : (mod) => this.current = mod 
        }

        let toolbar = [];// toolbar buttons
        if(selected)
        {
            
            if(selected.value)
            {
                toolbar.push('Save');
                const list = selected.type==='location' ? this.props.location : this.props.category;
                const found = list.find(function(element) {
                    return element.Name === selected.value;
                });
                  
                if(found) toolbar.push('Remove');
            }
            else{
                toolbar.push('Add');
            }
                
        }
        const btnStyle = {
            padding: 5,margin:5
        }
        const handleAction = this.handleAction.bind(this);
        const Toolbar = (
            <div style={{ display:'flex',flexFlow:'row',justifyContent: 'right' }}>
            {
                toolbar.map(function(label,j){
                    return (
                        <span  key={j} >
                            <Button color="primary" onClick={(e) => handleAction(e,label)} style={btnStyle}>{label}</Button>{' '}
                        </span>
                    )
                })
            }                        
            </div>
        );


        return (
            <div>

                <Navbar color="light" light expand="md">
                    <NavbarBrand><strong>{view}</strong></NavbarBrand>
                    {Toolbar}
                </Navbar>
                <div>
                    <Switch>
                        <Route exact path={`/category/:category`} 
                            render={(props) => (
                                <CategoryItem  {...props} {...sharedProps}
                                   
                                />
                        )}/> 
                        <Route exact path={`/category`} render={(props) => (
                                <CategoryView  {...props} {...sharedProps}/>
                            )}
                        />
                        <Route exact path={`/location/:location`} render={(props) => (
                                <LocationItem  {...props} {...sharedProps}/>
                            )}
                        />
                        <Route exact path={`/location`} render={(props) => (
                                <LocationView  {...props} {...sharedProps}/>
                            )}
                        />
                        <Route exact path={`/`}  render={(props) => (
                                <LocationView  {...props} {...sharedProps}/>
                            )}
                        />
                    </Switch>
                </div>


                <div style={{ display:'flex',flexFlow:'row',justifyContent: 'center' }}>

                    <Button color="primary" onClick={ (e)=>changeView('location') } style={btnStyle}>
                        Location{' '}<GoLocation />
                    </Button>
                
                    <Button color="primary" onClick={ (e)=>changeView('category') } style={btnStyle}>
                        Category{' '}<IoIosCopyOutline />
                    </Button>

                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    category: state.category,
    location: state.location
});

export default withRouter(connect(mapStateToProps)(MainView));
