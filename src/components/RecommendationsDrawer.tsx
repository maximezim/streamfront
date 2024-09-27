import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Recommendations } from './Recommendations'

interface RecommendationItem {
  id: string;
  title: string;
  thumbnailUrl: string;
}

interface RecommendationsDrawerProps {
  items: RecommendationItem[];
  isOpen: boolean;
}

export function RecommendationsDrawer({ items, isOpen }: RecommendationsDrawerProps) {
  return (
    <Drawer open={isOpen}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-4xl">
          <DrawerHeader>
            <DrawerTitle>Recommendations</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            {items.length > 0 ? (
              <Recommendations items={items} />
            ) : (
              <div className="text-center py-8">
                <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                  No recommendations available at the moment.
                </p>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                  Check back later for new content suggestions!
                </p>
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
