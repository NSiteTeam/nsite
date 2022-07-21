import { computed } from "vue"

export const TextSizes = {
  'xs': {
    type: Boolean,
    default: false
  },
  'sm': {
    type: Boolean,
    default: false
  },
  'lg': {
    type: Boolean,
    default: false
  },
  'xl': {
    type: Boolean,
    default: false
  },
  '2xl': {
    type: Boolean,
    default: false
  },
  '3xl': {
    type: Boolean,
    default: false
  },
  '4xl': {
    type: Boolean,
    default: false
  },
  '5xl': {
    type: Boolean,
    default: false
  },
  '6xl': {
    type: Boolean,
    default: false
  },
  '7xl': {
    type: Boolean,
    default: false
  },
  '8xl': {
    type: Boolean,
    default: false
  },
  '9xl': {
    type: Boolean,
    default: false
  }
}

export function isBase(props: any) {
  return !(props.xs || props.sm || props.lg || props['2xl'] || props['3xl'] || props['4xl'] || props['5xl'] || props['6xl'] || props['7xl'] || props['8xl'] || props['9xl'])
}

export function textSize(props: any, base: boolean) {
  if (props['xs']) {
    return 'h-3'
  } else if (props['sm']) {
    return 'h-3.5'
  } else if (base) {
    return 'h-4'
  } else if (props['lg']) {
    return 'h-5'
  } else if (props['xl']) {
    return 'h-5'
  } else if (props['2xl']) {
    return 'h-6'
  } else if (props['3xl']) {
    return 'h-8'
  } else if (props['4xl']) {
    return 'h-10'
  } else if (props['5xl']) {
    return 'h-12'
  } else if (props['6xl']) {
    return 'h-16'
  } else if (props['7xl']) {
    return 'h-20'
  } else if (props['8xl']) {
    return 'h-24'
  } else if (props['9xl']) {
    return 'h-32'
  }
}

export function fontSize(props: any, base: boolean) {
  if (props['xs']) {
    return 'text-xs'
  } else if (props['sm']) {
    return 'text-sm'
  } else if (base) {
    return 'text-base'
  } else if (props['lg']) {
    return 'text-lg'
  } else if (props['xl']) {
    return 'text-xl'
  } else if (props['2xl']) {
    return 'text-2xl'
  } else if (props['3xl']) {
    return 'text-3xl'
  } else if (props['4xl']) {
    return 'text-4xl'
  } else if (props['5xl']) {
    return 'text-5xl'
  } else if (props['6xl']) {
    return 'text-6xl'
  } else if (props['7xl']) {
    return 'text-7xl'
  } else if (props['8xl']) {
    return 'text-8xl'
  } else if (props['9xl']) {
    return 'text-9xl'
  }
}

export function roundedSize(props: any, base: boolean) {
  if (props['xs']) {
    return 'rounded-sm'
  } else if (props['sm']) {
    return 'rounded-md'
  } else if (base) {
    return 'rounded-lg'
  } else if (props['lg']) {
    return 'rounded-xl'
  } else if (props['xl']) {
    return 'rounded-2xl'
  } else if (props['2xl']) {
    return 'rounded-3xl'
  } else if (props['3xl']) {
    return 'rounded-full'
  } else if (props['4xl']) {
    return 'rounded-full'
  } else if (props['5xl']) {
    return 'rounded-full'
  } else if (props['6xl']) {
    return 'rounded-full'
  } else if (props['7xl']) {
    return 'rounded-full'
  } else if (props['8xl']) {
    return 'rounded-full'
  } else if (props['9xl']) {
    return 'rounded-full'
  }
}
