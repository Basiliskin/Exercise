import React, {Component} from 'react';

import {bindActionCreators} from 'redux';
import {connect} from "react-redux";

import {actions,ActionMode} from './store/actions/locationActions.jsx';

import {  Input,Button,
    Form, FormGroup,Label,Col,
    Breadcrumb, BreadcrumbItem,
    Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';

import GoLocation  from 'react-icons/lib/go/location';

import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

class LocationCategory extends Component {
    constructor(props) {
        super(props);
    
        this.toggle = this.toggle.bind(this);
        this.state = {
          dropdownOpen: false
        };
    }
    
    toggle() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }
    render()
    {
        const {list} = this.props;

        const add = this.props.add;
        const categoryList = (
            <DropdownMenu>
                {
					list.map(function(item,j){
                        const category = item.Name;
                        return <DropdownItem key={j} onClick={(e)=> add(e,category) }>{category}</DropdownItem>
                    })
                }
            </DropdownMenu>
        );

        return (
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                <DropdownToggle caret>
                    Add
                </DropdownToggle>
                {categoryList}
            </Dropdown>
        )
    }
}

class LocationCoordinates extends Component {
    constructor(props)
    {
        super(props);
        const {Coordinates} = props;
        this.state = {
            center: {
              lat: Coordinates.lat || 51.505,
              lng: Coordinates.lng || -0.09
            },
            marker: {
                lat: Coordinates.lat || 51.505,
                lng: Coordinates.lng || -0.09
            },
            zoom: 13,
            draggable: true,
        }
    }
    
    toggleDraggable = () => {
        this.setState({ draggable: !this.state.draggable })
    }

    updatePosition = () => {
        const { lat, lng } = this.refs.marker.leafletElement.getLatLng()
        //console.log('updatePosition',lat, lng);
        this.props.onUpdate({lat, lng });
        this.setState({
            marker: { lat, lng },
        })
    }    
    render()
    {

        const position = [this.state.center.lat, this.state.center.lng]
        const markerPosition = [this.state.marker.lat, this.state.marker.lng]
  
        return (
            <div id="main-wrap">
                <Map 
                    ref="map"
                    
                    center={position} 
                    length={4}
                    zoom={this.state.zoom}>
                    <TileLayer
                        attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker
                        draggable={this.state.draggable}
                        onDragend={this.updatePosition}
                        position={markerPosition}
                        ref="marker">
                        <Popup minWidth={90}>
                            <span onClick={this.toggleDraggable}>
                            {this.state.draggable ? 'DRAG MARKER' : 'MARKER FIXED'}
                            </span>
                        </Popup>
                    </Marker>
                </Map>
            </div>
        )
    }
}
class LocationItem extends Component {
    constructor(props)
    {
        super(props);
        const Name = props.match.params[ActionMode] || '';
        const found = props.location.find(function(element) {
            return element.Name === Name;
        }); 
		this.state = Object.assign({
            Name:'',
            Category:undefined,
            Coordinates:{lat:0,lng:0},
            Address:''
        },found);
    }
    componentDidMount()
    {
        window.navigator.vibrate([500]);
        this.Validate();
    }
    Validate(set,attr)
    {
        let {Name,Category,Coordinates,Address} = this.state;
        //console.log(Name,Category,Coordinates,Address);
        if(set)
        {
            switch(attr)
            {
                case 'Name':
                    Name = set.Name;
                    break;
                case 'Category':
                    Category = set.Category;
                    break;
                case 'Coordinates':
                    Coordinates = set.Coordinates;
                    break;
                case 'Address':
                    Address = set.Address;
                    break;
                default:
                    break;
            }


            this.setState(set);
        }
        

        if(Name && Category && Category.length && Coordinates.lat && Coordinates.lng && Address)
            this.props.selectItem({
                type:ActionMode,
                value:Name
            });
        else
            this.props.selectItem();
    }
    onChange(event,name)
    {
        //this.setState({[name]: event.target.value});
        this.Validate({[name]: event.target.value},name);
    }
    onUpdateCoordinates(marker)
    {
        //this.setState({Coordinates: marker});
        this.Validate({Coordinates: marker},'Coordinates');
    }
    handleAction(cmd)
    {
        let {Name,Category,Coordinates,Address} = this.state;
        if(cmd==='Save')
        {
            this.props.actions.newLocation({Name,Category,Coordinates,Address});
        }
        else
        {
            this.props.actions.deleteLocation({Name});
        }
        this.props.history.goBack();
        //console.log('handleAction',cmd,Name,Category,Coordinates,Address);
    }
    categoryRemove(e,Name)
    {
        let {Category} = this.state;
        Category = Category || [];
        Category = Category.filter(f => f !== Name);
        //this.setState({Category: Category});
        this.Validate({Category: Category},'Category');
    }
    categoryAdd(e,Name)
    {
        let {Category} = this.state;
        Category = Category || [];
        //this.setState({Category: [...Category,Name]});
        this.Validate({Category: [...Category,Name]},'Category');
    }
    render()
    {
        const state = this.state;
        let {Coordinates,Category} = state;
        const fields = 'Name,Address'.split(',');
        const onChange = this.onChange.bind(this);
        const categoryRemove = this.categoryRemove.bind(this);
        const categoryAdd = this.categoryAdd.bind(this);
        const onUpdateCoordinates = this.onUpdateCoordinates.bind(this);
        const reffer = (mod,name) => {
            this[name] = mod;
        };
        Category = Category || [];
        const categoryList = (
            <Breadcrumb>
                {
					Category.map(function(name,j){
                        return <BreadcrumbItem key={j} onClick={(e)=> categoryRemove(e,name) }><a href="#" style={{ textDecoration:'none'}}>{name}</a></BreadcrumbItem>
                    })
                }
            </Breadcrumb>
        );
        const result = this.props.category.filter(item => 
            Category.findIndex((name)=> name===item.Name)<0
        );
        const categoryField = result.length ? <LocationCategory list={result} add={categoryAdd}/> : <span/>;
        const fielList = (
            <Form>            
                {
					fields.map(function(name,j){
                        return ( 
                            <FormGroup row key={j}>
                                <Label sm={2}>{name}</Label>
                                <Col sm={10}>
                                    <Input placeholder={name} ref={(mod)=> reffer(mod,name) } value={state[name]}
                                         onChange={(e)=>onChange(e,name)}
                                    />
                                </Col>
                            </FormGroup> 
                        )
                    })
                }
                <FormGroup row>
                    <Label sm={2}>Coordinates</Label>
                    <Col sm={5}>
                        <Input value={Coordinates.lat} readOnly/>
                    </Col>
                    <Col sm={5}>
                        <Input value={Coordinates.lng} readOnly/>
                    </Col>
                </FormGroup> 
                <FormGroup row>
                    <Label sm={2}>Category</Label>
                    <Col sm={6}>
                        {categoryList}
                    </Col>
                    <Col sm={4}>
                        {categoryField}
                    </Col>
                </FormGroup> 
            </Form>            
        );
        return (
            <div>
                {fielList}
                <LocationCoordinates onUpdate={onUpdateCoordinates} Coordinates={Coordinates}/>
            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    location: state.location,
    category: state.category
});
  
const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
});
  
export default connect(mapStateToProps, mapDispatchToProps,null, { withRef: true })(LocationItem);