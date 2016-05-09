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
use Folklore\EloquentMediatheque\Traits\DocumentableTrait;

use Conner\Tagging\Taggable as TaggableTrait;

use Panneau\Support\Traits\HasFields;
use Panneau\Support\Traits\HasFieldsSnippet;

class Bubble extends Model
{
    use HasFields, HasFieldsSnippet, TaggableTrait, AudibleTrait, FilmableTrait, LinkableTrait, MetadatableTrait, PicturableTrait, WritableTrait, DocumentableTrait;
    
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
    
    protected $bubbleType;
    
    /**
     * Model fields
     */
    protected function getBubbleType()
    {
        if($this->bubbleType)
        {
            return $this->bubbleType;
        }
        
        $bubbleType = app('panneau')->bubbleType($this->type);
        $this->bubbleType = $bubbleType->withModel($this);
        return $this->bubbleType;
    }
    
    protected function getFieldsCollection()
    {
        return $this->getBubbleType()->getFields();
    }
    
    protected function getFieldsSnippet()
    {
        return $this->getBubbleType()->getSnippet();
    }
    
    /**
     * Scopes
     */
    public function scopeSearch($query, $text)
    {
        $query->where(function($query) use ($text)
        {
            $metadatasTable = config('mediatheque.table_prefix').'metadatas';
            $query->whereHas('metadatas', function($query) use ($text, $metadatasTable)
            {
                $query->where($metadatasTable.'.value' , 'LIKE', '%'.$text.'%');
            });
            
            $textsTable = config('mediatheque.table_prefix').'texts';
            $query->orWhereHas('texts', function($query) use ($text, $textsTable)
            {
                $query->where($textsTable.'.content' , 'LIKE', '%'.$text.'%');
            });
            
            $query->orWhere('handle' , 'LIKE', '%'.$text.'%');
        });
    }
}
