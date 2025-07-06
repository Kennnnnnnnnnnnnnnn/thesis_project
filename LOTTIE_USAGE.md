# Lottie Animation Usage Guide

## Installation
Lottie-web has been installed in your Vue project. You can now use beautiful animations in your components.

## Components Created

### 1. LottieAnimation.vue
A reusable Vue component for displaying Lottie animations.

### 2. LottieExample.vue
An example component demonstrating how to use the LottieAnimation component.

## Basic Usage

### Import the Component
```vue
<script setup>
import LottieAnimation from '@/components/LottieAnimation.vue';
</script>
```

### Basic Implementation
```vue
<template>
  <LottieAnimation
    :animation-data="yourAnimationData"
    width="200px"
    height="200px"
    :speed="1"
    :loop="true"
    :autoplay="true"
    @complete="onComplete"
  />
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `animationData` | Object/String | Required | Lottie JSON data or URL |
| `width` | String/Number | '100%' | Container width |
| `height` | String/Number | '100%' | Container height |
| `speed` | Number | 1 | Animation speed (1 = normal) |
| `loop` | Boolean | true | Whether to loop animation |
| `autoplay` | Boolean | true | Whether to autoplay |
| `direction` | Number | 1 | Direction (1 = forward, -1 = reverse) |
| `renderer` | String | 'svg' | Renderer type ('svg', 'canvas', 'html') |

## Events

| Event | Description |
|-------|-------------|
| `complete` | Fired when animation completes |
| `loopComplete` | Fired when loop completes |
| `enterFrame` | Fired on each frame |
| `segmentStart` | Fired when segment starts |
| `error` | Fired when error occurs |

## Methods (via ref)

```vue
<template>
  <LottieAnimation ref="animation" :animation-data="data" />
  <button @click="play">Play</button>
  <button @click="pause">Pause</button>
  <button @click="stop">Stop</button>
</template>

<script setup>
import { ref } from 'vue';
import LottieAnimation from '@/components/LottieAnimation.vue';

const animation = ref(null);

const play = () => {
  animation.value?.play();
};

const pause = () => {
  animation.value?.pause();
};

const stop = () => {
  animation.value?.stop();
};

const setSpeed = (speed) => {
  animation.value?.setSpeed(speed);
};

const setDirection = (direction) => {
  animation.value?.setDirection(direction);
};
</script>
```

## Where to Find Lottie Animations

### Free Resources:
1. **LottieFiles** (https://lottiefiles.com) - Largest collection of free animations
2. **IconScout** (https://iconscout.com) - Free and premium animations
3. **LottieFlow** (https://lottieflow.com) - Curated animations

### Popular Animation Types:
- Loading spinners
- Success/Error states
- Empty states
- Micro-interactions
- Page transitions

## Example Use Cases in Your Project

### 1. Loading States
```vue
<template>
  <div v-if="isLoading" class="loading-container">
    <LottieAnimation
      :animation-data="loadingAnimation"
      width="100px"
      height="100px"
      :loop="true"
      :autoplay="true"
    />
    <p>Loading...</p>
  </div>
</template>
```

### 2. Success/Error Messages
```vue
<template>
  <div v-if="showSuccess" class="success-message">
    <LottieAnimation
      :animation-data="successAnimation"
      width="80px"
      height="80px"
      :loop="false"
      :autoplay="true"
      @complete="hideSuccess"
    />
    <p>Operation completed successfully!</p>
  </div>
</template>
```

### 3. Empty States
```vue
<template>
  <div v-if="items.length === 0" class="empty-state">
    <LottieAnimation
      :animation-data="emptyAnimation"
      width="200px"
      height="200px"
      :loop="true"
      :autoplay="true"
    />
    <h3>No items found</h3>
    <p>Try adding some items to get started</p>
  </div>
</template>
```

## Tips for Best Performance

1. **Optimize JSON files**: Use tools like LottieFiles optimizer
2. **Use appropriate sizes**: Don't make animations too large
3. **Limit concurrent animations**: Too many animations can impact performance
4. **Use autoplay wisely**: Only autoplay when necessary
5. **Clean up**: Always destroy animations when component unmounts

## Troubleshooting

### Common Issues:
1. **Animation not showing**: Check if JSON data is valid
2. **Performance issues**: Reduce animation complexity or size
3. **Not looping**: Ensure `loop` prop is set to `true`
4. **Not autoplaying**: Check `autoplay` prop and browser autoplay policies

### Debug Tips:
- Check browser console for errors
- Verify JSON structure is valid
- Test with simple animations first
- Use browser dev tools to inspect animation elements

## Integration with Your Existing Components

You can now add Lottie animations to:
- Loading states in your admin panels
- Success/error messages in forms
- Empty states in lists
- Micro-interactions in buttons
- Page transitions
- Notification animations

The LottieAnimation component is ready to use throughout your Vue application! 