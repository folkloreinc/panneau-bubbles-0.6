<?php namespace Panneau\Bubbles;

use Panneau\Panneau;
use Panneau\Support\ServiceProvider;

class BubblesServiceProvider extends ServiceProvider
{
    protected $resources = array(
        'bubbles' => '\Panneau\Bubbles\BubblesResource'
    );
    
    protected $assets = array(
        'bubbles_js' => 'vendor/panneau-bubbles/js/bubbles.js',
        'bubbles_css' => 'vendor/panneau-bubbles/css/bubbles.css'
    );
    
    public function boot()
    {
        parent::boot();
        
        $migrationsPath = __DIR__.'/../../migrations/';
        $translationsPath = __DIR__.'/../../resources/lang/';
        $assetsPath = __DIR__.'/../../resources/assets/build/';
        
        $this->loadTranslationsFrom($translationsPath, 'panneau-bubbles');

        $this->publishes([
            $migrationsPath => database_path('migrations')
        ], 'migrations');
        
        $this->publishes([
            $assetsPath => public_path('vendor/panneau-bubbles')
        ], 'assets');
        
        $this->registerBubbleTypes();
    }
    
    protected function registerBubbleTypes()
    {
        $panneau = app('panneau');
        $panneau->registerBubbleType('Panneau\Bubbles\Support\BubbleType');
    }
    
    public function register()
    {
        parent::register();
        
        $this->registerMacro();
    }
    
    protected function registerMacro()
    {
        $app = $this->app;
        Panneau::macro('registerBubbleType', function($class, $key = null) use ($app)
        {
            if(!$key)
            {
                $key = with(is_object($class) ? $class:app($class))->type;
            }
            
            return $this->bind('bubble.'.$key, $class);
        });
        
        Panneau::macro('bubbleType', function($key) use ($app)
        {
            return class_exists($key) || $app->bound($key) ? app($key):app('panneau.bubble.'.$key);
        });
    }
}
