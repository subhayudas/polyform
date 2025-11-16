
import React, { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MaterialsGrid from './MaterialsGrid';
import { Search, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Material {
  name: string;
  properties: string[];
  applications: string[];
  image?: string;
  video?: string;
}

interface MaterialCategories {
  plastics: Material[];
  metals: Material[];
  composites: Material[];
  elastomers: Material[];
}

interface MaterialsTabsProps {
  materialCategories: MaterialCategories;
}

const MaterialsTabs = ({ materialCategories }: MaterialsTabsProps) => {
  const [activeTab, setActiveTab] = useState('plastics');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'name' | 'applications'>('default');

  const getCurrentMaterials = () => {
    switch (activeTab) {
      case 'plastics':
        return materialCategories.plastics;
      case 'metals':
        return materialCategories.metals;
      case 'composites':
        return materialCategories.composites;
      case 'elastomers':
        return materialCategories.elastomers;
      default:
        return [];
    }
  };

  const filteredMaterials = useMemo(() => {
    let materials = getCurrentMaterials();

    // Filter by search query
    if (searchQuery) {
      materials = materials.filter(material =>
        material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.properties.some(p => p.toLowerCase().includes(searchQuery.toLowerCase())) ||
        material.applications.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort
    if (sortBy === 'name') {
      materials = [...materials].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'applications') {
      materials = [...materials].sort((a, b) => b.applications.length - a.applications.length);
    }

    return materials;
  }, [activeTab, searchQuery, sortBy, materialCategories]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchQuery(''); // Reset search when changing tabs
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSortBy('default');
  };

  const hasActiveFilters = searchQuery || sortBy !== 'default';

  return (
    <div className="w-full space-y-6">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
          <TabsList className="grid w-full md:w-auto grid-cols-4">
            <TabsTrigger value="plastics">Plastics</TabsTrigger>
            <TabsTrigger value="metals">Metals</TabsTrigger>
            <TabsTrigger value="composites">Composites</TabsTrigger>
            <TabsTrigger value="elastomers">Elastomers</TabsTrigger>
          </TabsList>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-8"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
            
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="applications">Applications</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 flex-wrap"
          >
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {searchQuery && (
              <Badge variant="secondary" className="gap-2">
                Search: "{searchQuery}"
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            )}
            {sortBy !== 'default' && (
              <Badge variant="secondary" className="gap-2">
                Sort: {sortBy === 'name' ? 'Name (A-Z)' : 'Applications'}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0"
                  onClick={() => setSortBy('default')}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="h-7 text-xs"
            >
              Clear All
            </Button>
          </motion.div>
        )}

        {/* Results count */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-muted-foreground"
          >
            Found {filteredMaterials.length} material{filteredMaterials.length !== 1 ? 's' : ''}
          </motion.div>
        )}
        
        <TabsContent value="plastics">
          <AnimatePresence mode="wait">
            {filteredMaterials.length > 0 ? (
              <motion.div
                key="materials-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <MaterialsGrid materials={filteredMaterials} />
              </motion.div>
            ) : (
              <motion.div
                key="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium text-muted-foreground mb-2">No materials found</p>
                <p className="text-sm text-muted-foreground mb-4">Try adjusting your search or filters</p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>
        
        <TabsContent value="metals">
          <AnimatePresence mode="wait">
            {filteredMaterials.length > 0 ? (
              <motion.div
                key="materials-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <MaterialsGrid materials={filteredMaterials} />
              </motion.div>
            ) : (
              <motion.div
                key="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium text-muted-foreground mb-2">No materials found</p>
                <p className="text-sm text-muted-foreground mb-4">Try adjusting your search or filters</p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>
        
        <TabsContent value="composites">
          <AnimatePresence mode="wait">
            {filteredMaterials.length > 0 ? (
              <motion.div
                key="materials-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <MaterialsGrid materials={filteredMaterials} />
              </motion.div>
            ) : (
              <motion.div
                key="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium text-muted-foreground mb-2">No materials found</p>
                <p className="text-sm text-muted-foreground mb-4">Try adjusting your search or filters</p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>
        
        <TabsContent value="elastomers">
          <AnimatePresence mode="wait">
            {filteredMaterials.length > 0 ? (
              <motion.div
                key="materials-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <MaterialsGrid materials={filteredMaterials} />
              </motion.div>
            ) : (
              <motion.div
                key="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium text-muted-foreground mb-2">No materials found</p>
                <p className="text-sm text-muted-foreground mb-4">Try adjusting your search or filters</p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MaterialsTabs;
