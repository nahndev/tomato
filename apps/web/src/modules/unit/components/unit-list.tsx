"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger, Toaster } from "@tomato/ui";
import { UnitTab } from "../unit.constants";
import { UnitTypeManager } from "./types/unit-type-manager";
import { UnitManager } from "./units/unit-manager";

export function UnitList() {
  return (
    <div className="flex w-full flex-1 flex-col gap-6">
      <h1 className="text-xl font-medium">Units</h1>
      <Tabs defaultValue={UnitTab.UNITS}>
        <TabsList>
          <TabsTrigger value={UnitTab.UNITS}>Units</TabsTrigger>
          <TabsTrigger value={UnitTab.TYPES}>Types</TabsTrigger>
        </TabsList>
        <TabsContent value={UnitTab.UNITS}>
          <UnitManager />
        </TabsContent>
        <TabsContent value={UnitTab.TYPES}>
          <UnitTypeManager />
        </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  );
}
