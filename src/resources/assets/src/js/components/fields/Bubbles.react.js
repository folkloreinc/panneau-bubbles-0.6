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
            addPlaceholder: 'Rechercher pour ajouter...'
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
        
        var className = 'form-group form-group-bubbles';
        
        var addIndex = (this.props.value || []).length;
        var onAddChange = _.bind(function(value)
        {
            this.onBubbleChange(value,addIndex);
        }, this);
        var addBubbleName = this.props.name+'['+addIndex+']';
        
        var addPlaceholder = this.props.addPlaceholder;
        
        return (
            <div className={className}>
                { label }
                <div ref="list" className="list">
                    {bubbles}
                </div>
                <BubbleField name={addBubbleName} placeholder={addPlaceholder} onChange={onAddChange} queryUrl={this.props.queryUrl} queryWildcard={this.props.queryWildcard} />
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
        
        return (
            <BubbleField key={key} name={inputName} value={bubble} onChange={onChange} queryUrl={this.props.queryUrl} queryWildcard={this.props.queryWildcard} />
        );
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
