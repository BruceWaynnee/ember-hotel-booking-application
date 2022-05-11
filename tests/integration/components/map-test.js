import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import ENV from 'ember-hotel-booking-application/config/environment';

module('Integration | Component | map', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders a map image for the specific parameters', async function(assert){
    await render(hbs`<Map
      @lat="37.7797"
      @lng="-122.4184"
      @zoom="10"
      @width="150"
      @height="120"
    />`);

    assert.dom('.map img')
      .exists()
      .hasAttribute('alt', 'Map image at coordinates 37.7797, -122.4184')
      .hasAttribute('src')
      .hasAttribute('width', '150')
      .hasAttribute('height', '120');
    
    let { src } = find('.map img');
    let token   = encodeURIComponent(ENV.MAPBOX_ACCESS_TOKEN);

    assert.ok(
      src.startsWith('https://api.mapbox.com/'),
      'the src starts with "https://api.mapbox.com/"'
    );

    assert.ok(
      src.includes('-122.4184,37.7797,10'), 
      'the src should include the lat, lng and zoom @2x parameters'
      );

    assert.ok(
      src.includes('150x120@2x'),
      'the src should include the width, height and @2x parameter'
    );

    assert.ok(
      src.includes(`access_token=${token}`),
      'the src should include the escaped access token'
    );
  });

  test('the default alt attribute can be overridden', async function(assert){
    await render(hbs`<Map
      @lat="37.7797"
      @lng="-122.4184"
      @zoom="10"
      @width="150"
      @height="120"
      alt="A map of Phnom Penh Cambodia"
    />`);

    assert.dom('.map img')
      .exists()
      .hasAttribute('alt', "A map of Phnom Penh Cambodia");
  });

  test('the src, width and height can not be overridden', async function(assert){
    await render(hbs`<Map
      @lat="37.7797"
      @lng="-122.4184"
      @zoom="10"
      @width="150"
      @height="120"
      src="/assets/images/teaching-tomster.png"
      width="50"
      height="50"
    />`);

    assert.dom('.map img')
      .exists()
      .hasAttribute('src', /^https:\/\/api\.mapbox\.com\//)
      .hasAttribute('width', '150')
      .hasAttribute('height', '120');
  });

  test('it update the `src` attribute when the arguments change', async function(assert){
    this.setProperties({
      lat    : 37.7749,
      lng    : -122.4194,
      zoom   : 9,
      width  : 150,
      height : 150,
    });

    await render(hbs`<Map
      @lat={{this.lat}}
      @lng={{this.lng}}
      @zoom={{this.zoom}}
      @width={{this.width}}
      @height={{this.height}}
      @alt={{this.alt}}
    />`);

    let img = find('.map img');

    assert.ok(
      img.src.includes('-122.4194,37.7749'),
      'the src should include the lng,lat,zoom parameters'
    );
    
    assert.ok(
      img.src.includes('150x150@2x'),
      'the src should include the width,height and @2x parameters'
    );

    this.setProperties({
      width: 500,
      height: 500,
      zoom: 12,
    });

    assert.ok(
      img.src.includes('-122.4194,37.7749'),
      'the src should include the lng,lat,zoom parameters'
    );
    
    assert.ok(
      img.src.includes('500x500@2x'),
      'the src should include the width,height and @2x parameters'
    );

    this.setProperties({
      lat: 47.6062,
      lng: -122.3321,
    });

    assert.ok(
      img.src.includes('-122.3321,47.6062'),
      'the src should include the lng,lat,zoom parameters'
    );
    
    assert.ok(
      img.src.includes('500x500@2x'),
      'the src should include the width,height and @2x parameters'
    );
  });
});
