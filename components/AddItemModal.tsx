'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createItem } from '@/lib/apiService';

interface AddItemFormValues {
  name: string;
  description: string;
  category: string;
  photo: FileList;
}

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  communityId: string;
  onItemAdded: () => void;
}

type ClassifyStatus =
  | { state: 'idle' }
  | { state: 'loading-scripts' }
  | { state: 'classifying' }
  | { state: 'result'; label: string; category: string; itemName: string; description: string }
  | { state: 'error' };

// ---------------------------------------------------------------------------
// Category mapping — ImageNet class names normalised to lowercase_underscores
// ---------------------------------------------------------------------------

const CATEGORY_KEYWORDS: [string, string[]][] = [
  ['Tools', [
    'drill', 'power_drill', 'hand_tool', 'screwdriver', 'hammer', 'wrench',
    'hand_saw', 'chain_saw', 'chainsaw', 'lathe', 'chisel', 'planer',
    'corkscrew', 'rule', 'ruler', 'level', 'carpenter_level', 'tape_measure',
    'paintbrush', 'paint_brush', 'ladder', 'wheelbarrow', 'plow', 'hatchet',
    'axe', 'shovel', 'trowel', 'pitchfork', 'scythe', 'lawn_mower',
    'staple_gun', 'nail_gun', 'soldering_iron', 'multimeter', 'clamp',
  ]],
  ['Electronics', [
    'laptop', 'notebook', 'desktop_computer', 'monitor', 'screen', 'television',
    'remote_control', 'cellular_telephone', 'mobile_phone', 'ipod', 'modem',
    'router', 'loudspeaker', 'speaker', 'radio', 'projector', 'keyboard',
    'mouse', 'joystick', 'hard_disc', 'disk', 'tape_player', 'cassette_player',
    'cd_player', 'vcr', 'camcorder', 'camera', 'digital_camera', 'reflex_camera',
    'polaroid_camera', 'printer', 'photocopier', 'scanner', 'modem',
    'oscilloscope', 'calculator', 'abacus', 'typewriter', 'pay_phone',
    'rotary_dial_telephone', 'answering_machine', 'amplifier', 'mixing_console',
    'headphones', 'earphone', 'hearing_aid', 'walkie_talkie',
  ]],
  ['Books & Education', [
    'book_jacket', 'comic_book', 'menu', 'newspaper', 'book', 'notebook',
    'pencil_box', 'pencil_sharpener', 'binder', 'backpack', 'school_bag',
    'globe', 'abacus', 'slide_rule', 'blackboard', 'chalkboard',
  ]],
  ['Sports & Outdoors', [
    'bicycle', 'mountain_bike', 'tricycle', 'unicycle', 'skateboard',
    'tennis_ball', 'golf_ball', 'volleyball', 'soccer_ball', 'rugby_ball',
    'basketball', 'cricket_ball', 'baseball', 'ping_pong', 'billiard_ball',
    'football_helmet', 'crash_helmet', 'ski', 'snowboard', 'surfboard',
    'tennis_racket', 'badminton', 'dumbbell', 'barbell', 'weight',
    'punching_bag', 'tent', 'canoe', 'kayak', 'rowboat', 'paddleboat',
    'ice_skate', 'roller_skate', 'running_shoe', 'bow', 'crossbow', 'rifle',
    'parallel_bars', 'horizontal_bar', 'trampoline', 'scooter', 'moped',
    'kite', 'frisbee', 'golf_cart', 'parachute',
  ]],
  ['Music', [
    'acoustic_guitar', 'electric_guitar', 'bass_guitar', 'banjo', 'sitar',
    'ukulele', 'violin', 'cello', 'upright', 'harp', 'lute', 'dulcimer',
    'french_horn', 'cornet', 'trombone', 'trumpet', 'tuba', 'saxophone',
    'clarinet', 'oboe', 'bassoon', 'flute', 'harmonica', 'accordion',
    'organ', 'piano', 'grand_piano', 'drum', 'tabla', 'bongo', 'maraca',
    'marimba', 'xylophone', 'gong', 'steel_drum', 'microphone', 'chime',
    'panpipe', 'bagpipe', 'washboard',
  ]],
  ['Household', [
    'iron', 'vacuum', 'washer', 'washing_machine', 'dishwasher',
    'refrigerator', 'stove', 'oven', 'microwave', 'toaster_oven', 'fan',
    'ceiling_fan', 'lamp', 'table_lamp', 'floor_lamp', 'lampshade',
    'chair', 'rocking_chair', 'throne', 'folding_chair', 'couch',
    'studio_couch', 'park_bench', 'broom', 'mop', 'bucket', 'table',
    'coffee_table', 'wardrobe', 'chest', 'bookcase', 'filing_cabinet',
    'desk', 'sewing_machine', 'pillow', 'quilt', 'sleeping_bag',
    'shower_curtain', 'window_shade', 'doormat', 'toilet', 'bathtub',
  ]],
  ['Clothing & Fashion', [
    'jersey', 'sweatshirt', 'cardigan', 'coat', 'suit', 'sunglasses',
    'shoe', 'boot', 'sneaker', 'sandal', 'clog', 'scarf', 'bow_tie',
    'miniskirt', 'bikini', 'stole', 'trench_coat', 'kimono', 'apron',
    'lab_coat', 'military_uniform', 'swimming_trunks', 'hoopskirt',
    'balaclava', 'bonnet', 'mortarboard', 'academic_gown', 'mitten',
    'glove', 'umbrella', 'wallet', 'necklace', 'bracelet',
  ]],
  ['Bags & Luggage', [
    'backpack', 'mailbag', 'purse', 'handbag', 'shopping_bag',
    'suitcase', 'travel_bag', 'duffel_bag', 'kit_bag', 'plastic_bag',
    'sleeping_bag', 'tobacco_pouch', 'coin_purse',
  ]],
  ['Games & Toys', [
    'jigsaw_puzzle', 'crossword_puzzle', 'toy', 'rubik', 'chess',
    'chessboard', 'backgammon', 'pinball', 'pool_table', 'dartboard',
    'slot_machine', 'cue', 'doll', 'teddy', 'kite', 'yo_yo',
    'spinning_top', 'tiddlywink', 'domino', 'mahjong',
  ]],
  ['Kitchen', [
    'frying_pan', 'wok', 'pot', 'caldron', 'spatula', 'ladle', 'knife',
    'cleaver', 'can_opener', 'toaster', 'waffle_iron', 'blender', 'juicer',
    'food_processor', 'mixer', 'pressure_cooker', 'colander', 'whisk',
    'rolling_pin', 'mortar', 'cutting_board', 'coffeepot', 'teapot',
    'espresso_maker', 'rice_cooker', 'slow_cooker', 'dutch_oven',
    'measuring_cup', 'mixing_bowl', 'plate', 'bowl', 'chopsticks',
    'wine_bottle', 'water_bottle', 'beer_bottle',
    // ImageNet fruit/produce classes
    'granny_smith', 'hip', 'rose_hip', 'fig', 'pineapple', 'banana',
    'strawberry', 'orange', 'lemon', 'pomegranate', 'mushroom',
    'artichoke', 'cucumber', 'zucchini', 'head_cabbage', 'broccoli',
    'cauliflower', 'corn',
  ]],
];

function mapClassToCategory(className: string): string {
  const normalised = className.toLowerCase().replace(/[\s-]/g, '_');
  for (const [category, keywords] of CATEGORY_KEYWORDS) {
    if (keywords.some((kw) => normalised.includes(kw))) return category;
  }
  return 'Other';
}

// Some ImageNet class names are unhelpful — map them to a friendly display name.
const LABEL_OVERRIDES: Record<string, string> = {
  'hip':         'Apple',
  'rose hip':    'Apple',
  'rosehip':     'Apple',
  'granny smith':'Apple',
  'fig':         'Fig',
  'banana':      'Banana',
  'pineapple':   'Pineapple',
  'strawberry':  'Strawberry',
  'orange':      'Orange',
  'lemon':       'Lemon',
  'pomegranate': 'Pomegranate',
  'mushroom':    'Mushroom',
};

// Turn an ImageNet label like "power drill, drill" → "Power Drill"
function labelToItemName(className: string): string {
  const primary = className.split(',')[0].trim().toLowerCase();
  if (LABEL_OVERRIDES[primary]) return LABEL_OVERRIDES[primary];
  return primary
    .replaceAll('_', ' ')
    .replaceAll('-', ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const CATEGORY_DESCRIPTIONS: Record<string, (name: string) => string> = {
  'Tools':              (n) => `${n} in good working condition. Available for short-term lending — return clean and intact.`,
  'Electronics':        (n) => `${n} available to borrow. Handle with care and return fully charged where applicable.`,
  'Books & Education':  (n) => `${n} — great read! Borrow for up to 2 weeks and return in good condition.`,
  'Sports & Outdoors':  (n) => `${n} available for borrowing. Perfect for outdoor activities. Return after use.`,
  'Music':              (n) => `${n} available to borrow for practice or events. Handle carefully and return in good condition.`,
  'Household':          (n) => `${n} available for short-term use. Return once your task is done.`,
  'Clothing & Fashion': (n) => `${n} available to borrow for events or occasions. Please return clean.`,
  'Bags & Luggage':     (n) => `${n} available to borrow for travel or daily use. Return clean and undamaged.`,
  'Games & Toys':       (n) => `${n} — borrow for a fun day! Return with all pieces intact.`,
  'Kitchen':            (n) => `${n} available — great for cooking or sharing. Return clean after use.`,
  'Other':              (n) => `${n} available for lending. Return in the same condition.`,
};

// ---------------------------------------------------------------------------
// Script loader
// ---------------------------------------------------------------------------

const scriptLoadCache = new Map<string, Promise<void>>();

function loadScript(src: string): Promise<void> {
  if (scriptLoadCache.has(src)) return scriptLoadCache.get(src)!;

  const promise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing) { resolve(); return; }
    const el = document.createElement('script');
    el.src = src;
    el.async = true;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(el);
  });

  scriptLoadCache.set(src, promise);
  return promise;
}

const TF_CDN = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.20.0/dist/tf.min.js';
const MOBILENET_CDN = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.0/dist/mobilenet.min.js';

let cachedModel: Window['mobilenet'] extends { load(): Promise<infer M> } ? M | null : never = null as never;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AddItemModal({ isOpen, onClose, communityId, onItemAdded }: AddItemModalProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [classifyStatus, setClassifyStatus] = useState<ClassifyStatus>({ state: 'idle' });
  const imgRef = useRef<HTMLImageElement | null>(null);
  const form = useForm<AddItemFormValues>({
    defaultValues: { name: '', description: '', category: '' },
  });

  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;
    loadScript(TF_CDN)
      .then(() => loadScript(MOBILENET_CDN))
      .catch(() => {});
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) setClassifyStatus({ state: 'idle' });
  }, [isOpen]);

  const classifyImage = useCallback(async (file: File) => {
    if (typeof window === 'undefined') return;

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.src = objectUrl;
    imgRef.current = img;

    setClassifyStatus({ state: 'loading-scripts' });

    try {
      await loadScript(TF_CDN);
      await loadScript(MOBILENET_CDN);
    } catch {
      URL.revokeObjectURL(objectUrl);
      setClassifyStatus({ state: 'error' });
      return;
    }

    setClassifyStatus({ state: 'classifying' });

    await new Promise<void>((resolve, reject) => {
      if (img.complete) { resolve(); return; }
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Image failed to load'));
    });

    try {
      if (!cachedModel) cachedModel = await window.mobilenet.load();

      const predictions = await cachedModel.classify(img, 3);
      URL.revokeObjectURL(objectUrl);

      if (!predictions.length || predictions[0].probability < 0.28) {
        setClassifyStatus({ state: 'idle' });
        return;
      }

      const top = predictions[0];
      const category = mapClassToCategory(top.className);

      // Don't auto-fill if MobileNet recognises something (rose hip, coral, etc.)
      // that has no meaningful mapping to a borrowable item category.
      if (category === 'Other') {
        setClassifyStatus({ state: 'idle' });
        return;
      }

      const itemName = labelToItemName(top.className);
      const description = (CATEGORY_DESCRIPTIONS[category] ?? CATEGORY_DESCRIPTIONS['Other'])(itemName);

      setClassifyStatus({ state: 'result', label: top.className, category, itemName, description });

      form.setValue('name', itemName, { shouldDirty: true, shouldValidate: true });
      form.setValue('description', description, { shouldDirty: true, shouldValidate: true });
      form.setValue('category', category, { shouldDirty: true, shouldValidate: true });
    } catch {
      URL.revokeObjectURL(objectUrl);
      setClassifyStatus({ state: 'error' });
    }
  }, [form]);

  const handlePhotoChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      form.register('photo').onChange(e);
      const file = e.target.files?.[0];
      if (file) {
        classifyImage(file);
      } else {
        setClassifyStatus({ state: 'idle' });
      }
    },
    [classifyImage, form]
  );

  const onSubmit = async (values: AddItemFormValues) => {
    setSubmitError(null);

    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('category', values.category);
    formData.append('communityId', communityId);
    if (values.photo && values.photo.length > 0) {
      formData.append('photo', values.photo[0]);
    }

    try {
      await createItem(formData);
      onItemAdded();
      onClose();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const response = err.response as { data?: { message?: string } };
        setSubmitError(response.data?.message || 'Failed to add item.');
      } else {
        setSubmitError('An unexpected error occurred.');
      }
    }
  };

  const AiStatusLine = () => {
    if (classifyStatus.state === 'loading-scripts' || classifyStatus.state === 'classifying') {
      return (
        <div className="mt-2 flex items-center gap-2 rounded-md border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 px-3 py-2" aria-live="polite">
          <span className="inline-block h-3 w-3 shrink-0 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <span className="text-xs text-blue-700 dark:text-blue-400">AI is analysing your photo...</span>
        </div>
      );
    }

    if (classifyStatus.state === 'result') {
      return (
        <div className="mt-2 rounded-md border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/40 px-3 py-2" aria-live="polite">
          <p className="text-xs font-semibold text-green-700 dark:text-green-400 flex items-center gap-1.5">
            <span>✦</span> AI auto-filled name, category &amp; description
          </p>
          <p className="mt-0.5 text-xs text-green-600 dark:text-green-500">
            Detected: <strong>{classifyStatus.itemName}</strong> — edit any field if needed.
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Add a New Item</DialogTitle>
          <DialogDescription>
            Upload a photo and AI will auto-fill the details for you.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            {/* Photo first so AI fills the fields below */}
            <FormField
              control={form.control}
              name="photo"
              render={() => (
                <FormItem>
                  <FormLabel>Photo</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      {...form.register('photo')}
                      onChange={handlePhotoChange}
                    />
                  </FormControl>
                  <AiStatusLine />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Electric Drill" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your item..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Tools" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {submitError && (
              <p className="text-sm font-medium text-destructive">{submitError}</p>
            )}
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Adding Item...' : 'Add Item'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
