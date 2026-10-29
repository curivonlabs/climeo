import React, { memo } from 'react';
import {
  Plus,
  Search,
  Settings,
  ArrowLeft,
  Clock,
  CalendarDays,
  Wind,
  Sun,
  Sunset,
  CloudRainWind,
  Parasol,
  MapPin,
  ChevronRight,
  X,
  type LucideIcon,
} from 'lucide-react-native';

import type { ColorValue } from 'react-native';

const ICONS = {
  Plus,
  Search,
  Settings,
  ArrowLeft,
  Clock,
  CalendarDays,
  Wind,
  Sun,
  Sunset,
  CloudRainWind,
  Parasol,
  MapPin,
  ChevronRight,
  X,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

export type IconProps = {
  name: string;
  size?: number;
  color?: ColorValue;
  strokeWidth?: number;
  absoluteStrokeWidth?: boolean;
  validate?: boolean;
  fallback?: IconName;
  onInvalid?: 'fallback' | 'hide';
  accessibilityLabel?: string;
  accessibilityHint?: string;
};

const DEFAULT_SIZE = 24;
const DEFAULT_STROKE_WIDTH = 2;
const DEFAULT_FALLBACK: IconName = 'CircleHelp';

const LIMITS = {
  minSize: 1,
  maxSize: 128,
  minStrokeWidth: 0.5,
  maxStrokeWidth: 8,
  maxColorLength: 64,
};

const isValidNumber = (
  value: number,
  min: number,
  max: number,
): boolean => {
  return (
    typeof value === 'number' &&
    Number.isFinite(value) &&
    value >= min &&
    value <= max
  );
};

const isValidColor = (color: ColorValue): boolean => {
  if (typeof color !== 'string') {
    return false;
  }

  if (
    color.length === 0 ||
    color.length > LIMITS.maxColorLength ||
    /[\u0000-\u001F\u007F;]/.test(color)
  ) {
    return false;
  }

  return true;
};

const isValidIconName = (name: string): name is IconName => {
  return Object.prototype.hasOwnProperty.call(ICONS, name);
};

const GlobalIcon = ({
  name,
  size = DEFAULT_SIZE,
  color = '#000000',
  strokeWidth = DEFAULT_STROKE_WIDTH,
  absoluteStrokeWidth = false,
  validate = true,
  fallback = DEFAULT_FALLBACK,
  onInvalid = 'fallback',
  accessibilityLabel,
  accessibilityHint,
}: IconProps) => {
  const invalid = (condition: boolean): boolean => {
    return validate && condition;
  };

  const validName =
    typeof name === 'string' && isValidIconName(name);

  const validSize = isValidNumber(
    size,
    LIMITS.minSize,
    LIMITS.maxSize,
  );

  const validStrokeWidth = isValidNumber(
    strokeWidth,
    LIMITS.minStrokeWidth,
    LIMITS.maxStrokeWidth,
  );

  const validColor = isValidColor(color);

  const hasInvalidProps =
    invalid(!validName) ||
    invalid(!validSize) ||
    invalid(!validStrokeWidth) ||
    invalid(!validColor);

  if (hasInvalidProps && onInvalid === 'hide') {
    return null;
  }

  const safeName: IconName = validName
    ? name
    : isValidIconName(fallback)
      ? fallback
      : DEFAULT_FALLBACK;

  const safeSize = validSize ? size : DEFAULT_SIZE;

  const safeStrokeWidth = validStrokeWidth
    ? strokeWidth
    : DEFAULT_STROKE_WIDTH;

  const safeColor = validColor ? color : '#000000';

  const IconComponent = ICONS[safeName];

  return (
    <IconComponent
      size={safeSize}
      color={safeColor}
      strokeWidth={safeStrokeWidth}
      absoluteStrokeWidth={absoluteStrokeWidth}
      accessible={true}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel ?? name}
      accessibilityHint={accessibilityHint}
    />
  );
};

export const Icon = memo(GlobalIcon);

export const isValidIcon = isValidIconName;

export default Icon;