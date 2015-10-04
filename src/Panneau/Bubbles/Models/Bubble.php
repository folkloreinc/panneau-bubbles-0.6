<?php namespace Panneau\Bubbles\Models;

use Baum\Node as Model;
//use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Folklore\EloquentMediatheque\Traits\AudibleTrait;
use Folklore\EloquentMediatheque\Traits\FilmableTrait;
use Folklore\EloquentMediatheque\Traits\LinkableTrait;
use Folklore\EloquentMediatheque\Traits\MetadatableTrait;
use Folklore\EloquentMediatheque\Traits\PicturableTrait;
use Folklore\EloquentMediatheque\Traits\WritableTrait;

use Conner\Tagging\TaggableTrait;

use Panneau\Support\Traits\HasFields;
use Panneau\Support\Traits\HasFieldsSnippet;

class Bubble extends Model
{
    use HasFields, HasFieldsSnippet, TaggableTrait, AudibleTrait, FilmableTrait, LinkableTrait, MetadatableTrait, PicturableTrait, WritableTrait;
    
    protected $table = 'bubbles';
    
    // 'parent_id' column name
    protected $parentColumn = 'nesting_parent_id';

    // 'lft' column name
    protected $leftColumn = 'nesting_left';

    // 'rgt' column name
    protected $rightColumn = 'nesting_right';

    // 'depth' column name
    protected $depthColumn = 'nesting_depth';

    // guard attributes from mass-assignment
    protected $guarded = array('id', 'nesting_parent_id', 'nesting_left', 'nesting_right', 'nesting_depth');
    
    protected $fillable = [
        'type',
        'handle',
        'settings',
        'published'
    ];
    
    protected $visible = [
        'id',
        'type',
        'handle',
        'settings',
        'published',
        'condition',
        'fields',
        'snippet'
    ];
    
    protected $appends = [
        'fields',
        'snippet'
    ];
    
    protected $casts = [
        'settings' => 'object'
    ];
    
    protected $with = [
        'texts', 'pictures', 'metadatas'
    ];
    
    /**
     * Model fields
     */
    protected function getBubbleType()
    {
        $bubbleType = app('panneau')->bubbleType($this->type);
        return $bubbleType->withModel($this);
    }
    protected function getFieldsCollection()
    {
        return $this->getBubbleType()->fields;
    }
    protected function getFieldsSnippet()
    {
       return $this->getBubbleType()->snippet;
    }
}
