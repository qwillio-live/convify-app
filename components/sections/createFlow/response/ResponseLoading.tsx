import { Card } from "@/components/ui/card"

export const LoadingEl = () => {
    return <Card className="overflow-y-auto max-h-[70vh] p-4">
        <div className="animate-pulse">
            {/* Header skeleton */}
            <div className="border-b border-gray-200 py-2">
                <div className="flex gap-1 justify-between whitespace-nowrap">
                    <div className="w-24 h-4 bg-gray-300 rounded-md"></div> {/* Submission time */}
                    <div className="w-24 h-4 bg-gray-300 rounded-md"></div> {/* Label */}
                    {/* Additional label headers */}
                    <div className="w-24 h-4 bg-gray-300 rounded-md"></div>
                    <div className="w-24 h-4 bg-gray-300 rounded-md"></div>
                    <div className="w-24 h-4 bg-gray-300 rounded-md"></div>
                    <div className="w-24 h-4 bg-gray-300 rounded-md"></div>
                </div>
            </div>

            {/* Body skeleton */}
            <div className="py-4 flex flex-col gap-2">
                {/* Generating rows for skeleton */}
                <div className="flex gap-1 justify-between whitespace-nowrap">
                    <div className="w-24 h-4 bg-gray-300 rounded-md"></div> {/* Submission time */}
                    <div className="w-24 h-4 bg-gray-300 rounded-md"></div> {/* Label */}
                    {/* Additional label headers */}
                    <div className="w-24 h-4 bg-gray-300 rounded-md"></div>
                    <div className="w-24 h-4 bg-gray-300 rounded-md"></div>
                    <div className="w-24 h-4 bg-gray-300 rounded-md"></div>
                    <div className="w-24 h-4 bg-gray-300 rounded-md"></div>
                </div>
                <div className="flex gap-1 justify-between whitespace-nowrap">
                    <div className="w-24 h-4 bg-gray-300 rounded-md"></div> {/* Submission time */}
                    <div className="w-24 h-4 bg-gray-300 rounded-md"></div> {/* Label */}
                    {/* Additional label headers */}
                    <div className="w-24 h-4 bg-gray-300 rounded-md"></div>
                    <div className="w-24 h-4 bg-gray-300 rounded-md"></div>
                    <div className="w-24 h-4 bg-gray-300 rounded-md"></div>
                    <div className="w-24 h-4 bg-gray-300 rounded-md"></div>
                </div>
                <div className="flex gap-1 justify-between whitespace-nowrap">
                    <div className="w-24 h-4 bg-gray-300 rounded-md"></div> {/* Submission time */}
                    <div className="w-24 h-4 bg-gray-300 rounded-md"></div> {/* Label */}
                    {/* Additional label headers */}
                    <div className="w-24 h-4 bg-gray-300 rounded-md"></div>
                    <div className="w-24 h-4 bg-gray-300 rounded-md"></div>
                    <div className="w-24 h-4 bg-gray-300 rounded-md"></div>
                    <div className="w-24 h-4 bg-gray-300 rounded-md"></div>
                </div>
                <div className="flex gap-1 justify-between whitespace-nowrap">
                    <div className="w-24 h-4 bg-gray-300 rounded-md"></div> {/* Submission time */}
                    <div className="w-24 h-4 bg-gray-300 rounded-md"></div> {/* Label */}
                    {/* Additional label headers */}
                    <div className="w-24 h-4 bg-gray-300 rounded-md"></div>
                    <div className="w-24 h-4 bg-gray-300 rounded-md"></div>
                    <div className="w-24 h-4 bg-gray-300 rounded-md"></div>
                    <div className="w-24 h-4 bg-gray-300 rounded-md"></div>
                </div>
                <div className="flex gap-1 justify-between whitespace-nowrap">
                    <div className="w-24 h-4 bg-gray-300 rounded-md"></div> {/* Submission time */}
                    <div className="w-24 h-4 bg-gray-300 rounded-md"></div> {/* Label */}
                    {/* Additional label headers */}
                    <div className="w-24 h-4 bg-gray-300 rounded-md"></div>
                    <div className="w-24 h-4 bg-gray-300 rounded-md"></div>
                    <div className="w-24 h-4 bg-gray-300 rounded-md"></div>
                    <div className="w-24 h-4 bg-gray-300 rounded-md"></div>
                </div>
            </div>
        </div>
    </Card>
}