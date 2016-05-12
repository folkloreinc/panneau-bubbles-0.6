var React = require('react');
var Immutable = require('immutable');

var SortableMixin = Panneau.Mixins.Sortable;

var BubbleField = require('./Bubble.react');

var Bubbles = React.createClass({
    
    mixins: [SortableMixin],
    
    sortableOptions: {
        ref: 'list',
		model: 'value',
        onUpdate: 'onSortableUpdate'
    },
    
    getDefaultProps: function()
    {
        return {
            ItemField: BubbleField,
            queryUrl: '/panneau/bubbles?search=%QUERY',
            queryWildcard: '%QUERY',
            addPlaceholder: 'Rechercher pour ajouter...',
            removeButton: false,
            addButton: false,
            addButtonLabel: 'Ajouter'
        };
    },
    
    render: function()
    {
        var bubbles = this.renderBubbles(this.props.value || []);
        
        var label;
        if(this.props.label)
        {
            label = <label htmlFor={name} className="control-label">{this.props.label}</label>;
        }
        
        var BubbleField = this.props.ItemField;
        
        var className = 'form-group form-group-list form-group-bubbles';
        
        var addBubble;
        if(this.props.addButton)
        {
            addBubble = (
                <div className="well">
                    <button type="button" className="btn btn-primary" onClick={this.onClickAddButton}>
                        <span className="glyphicon glyphicon-plus"></span> { this.props.addButtonLabel }
                    </button>
                </div>
            );
        }
        else
        {
            var addIndex = (this.props.value || []).length;
            var onAddChange = _.bind(function(value)
            {
                this.onBubbleChange(value, addIndex);
            }, this);
            var addBubbleName = this.props.name+'['+addIndex+']';
            var addPlaceholder = this.props.addPlaceholder;
            var props = _.omit(this.props, ['name', 'value', 'addPlaceholder', 'label', 'ItemField', 'onChange']);
            
            addBubble = (
                <BubbleField
                    {...props}
                    name={addBubbleName}
                    placeholder={addPlaceholder}
                    onChange={onAddChange} />
            )
        }
        
        return (
            <div className={className}>
                { label }
                <div ref="list" className="list">
                    {bubbles}
                </div>
                <div className="form-group-add">
                    { addBubble }
                </div>
            </div>
        );
    },
    
    renderBubbles: function(bubbles)
    {
        return bubbles.map(_.bind(this.renderBubble, this));
    },
    
    renderBubble: function(bubble, index)
    {
        var key = 'bubble_'+index+'_'+bubble.id;
        
        var onChange = _.bind(function(value)
        {
            this.onBubbleChange(value,index);
        }, this);
        
        var inputName = this.props.name+'['+index+']';
        
        var BubbleField = this.props.ItemField;
        
        var props = _.omit(this.props, ['name', 'value', 'addPlaceholder', 'label', 'ItemField', 'onChange']);
        
        if(this.props.removeButton)
        {
            var onClickRemoveButton = _.bind(function(e)
            {
                this.onClickRemoveButton(e, index);
            }, this);
            
            return (
                <div className="form-group-bubbles-item" key={key}>
                    <div className="input-group">
                        <div className="input-group-field">
                            <BubbleField
                                {...props}
                                name={inputName}
                                value={bubble}
                                onChange={onChange}
                            />
                        </div>
                        <div className="input-group-btn">
                            <button type="button" className="btn btn-default" onClick={onClickRemoveButton}>
                                <span className="glyphicon glyphicon-trash"></span>
                            </button>
                        </div>
                    </div>
                </div>
            )
        }
        else
        {
            return (
                <BubbleField
                    {...props}
                    key={key}
                    name={inputName}
                    value={bubble}
                    onChange={onChange}
                />
            );
        }
    },
    
    onClickAddButton: function()
    {
        var addIndex = (this.props.value || []).length;
        this.onBubbleChange({}, addIndex);
    },
    
    onClickRemoveButton: function(e, index)
    {
        this.onBubbleChange(null, index);
    },
    
    onBubbleChange: function(value, index)
    {
        var currentValue = Immutable.fromJS(this.props.value || []);
        var newValue = !value ? currentValue.delete(index):currentValue.set(index, value);
        
        if(currentValue !== newValue)
        {
            value = newValue.toJS();
            
            if(this.props.onChange)
            {
                this.props.onChange(value);
            }
        }
    },
    
    onSortableUpdate: function(e)
    {
        if(this.props.onChange)
        {
            this.props.onChange(this.state.value);
        }
    }
    
});

module.exports = Bubbles;
