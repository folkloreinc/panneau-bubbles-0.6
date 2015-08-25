<?php namespace Panneau\Bubbles\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Folklore\EloquentMediatheque\Traits\AudibleTrait;
use Folklore\EloquentMediatheque\Traits\FilmableTrait;
use Folklore\EloquentMediatheque\Traits\LinkableTrait;
use Folklore\EloquentMediatheque\Traits\MetadatableTrait;
use Folklore\EloquentMediatheque\Traits\PicturableTrait;
use Folklore\EloquentMediatheque\Traits\WritableTrait;

use Cviebrock\EloquentTaggable\Contracts\Taggable;
use Cviebrock\EloquentTaggable\Traits\Taggable as TaggableTrait;

use Panneau\Support\Traits\HasFields;

class Bubble extends Model implements Taggable
{
    use HasFields, TaggableTrait, AudibleTrait, FilmableTrait, LinkableTrait, MetadatableTrait, PicturableTrait, WritableTrait;
    
    protected $table = 'bubbles';
    
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
        'fields'
    ];
    
    protected $appends = [
        'fields'
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
    protected function getFieldsManager()
    {
        $bubbleType = app('panneau')->bubbleType($this->type);
        return $bubbleType->withModel($this);
    }
}
