# Database Setup and Migration Guide

## Overview
This document describes the comprehensive database schema for the manufacturing upload and order system.

## Migration Files

The following migrations need to be applied in order:

1. `20250116000001_create_basic_tables.sql` - Basic tables (profiles, user_roles, materials, orders, notifications)
2. `20250116000002_enhance_order_system.sql` - Enhanced order system with order_files, order_items, etc.
3. `20250117000000_comprehensive_manufacturing_system.sql` - Comprehensive manufacturing system
4. `20250117000001_fix_comprehensive_system.sql` - Fixes and RLS policies for new tables

## Database Schema

### Core Tables

#### `orders` (Enhanced)
The main orders table with all configuration fields:
- `manufacturing_process_id` - Reference to manufacturing_processes
- `sub_process` - Sub-process within the manufacturing process
- `design_units` - mm, inch, or cm
- `material_type_id` - Reference to material_types
- `material_variant_id` - Reference to material_variants
- `selected_color` - Selected color for material
- `surface_finish_id` - Reference to surface_finishes
- `technical_drawing_path` - Path to technical drawing file
- `has_threads` - Boolean for threads requirement
- `threads_description` - Description of threads
- `has_inserts` - Boolean for inserts requirement
- `inserts_description` - Description of inserts
- `tolerance_type` - standard or tighter
- `tolerance_description` - Description of tolerance requirements
- `surface_roughness` - Surface roughness value
- `part_marking_id` - Reference to part_marking_types
- `has_assembly` - Boolean for assembly requirement
- `assembly_type` - no_assembly, assembly_test, or ship_in_assembly
- `finished_appearance` - standard or premium
- `inspection_type_id` - Reference to inspection_types
- `itar_compliance` - ITAR compliance acknowledgment
- `nda_acknowledged` - NDA acknowledgment

#### `manufacturing_processes`
Manufacturing process types:
- CNC Machining (Milling 3-axis, Milling 5-axis, Turning)
- Sheet Metal (Laser cutting, Bending)
- 3D Printing (FDM, SLA, SLS, MJF, DMLS, Polyjet)
- Injection Molding
- Vacuum Casting

#### `material_types`
Material categories:
- Metals: Aluminum, Stainless steel, Brass, Copper, Titanium, Mild steel, Alloy steel, Tool steel, Spring steel
- Plastics: ABS, Polycarbonate (PC), Nylon, Polypropylene (PP), POM, PTFE (Teflon), PMMA (Acrylic), Polyethylene (PE), PEEK, Bakelite
- Composites: FR4, Carbon Fiber
- Specialty: Rubber

#### `material_variants`
Specific material variants (e.g., Aluminum 6061, 7075, 5052, 2A12) with:
- Color options
- Cost per unit
- Density
- Setup cost
- Properties (JSONB)

#### `surface_finishes`
Surface finish options:
- Standard (250uin/6.3um Ra)
- Fine (125uin/3.2um Ra)
- Very Fine (63uin/1.6um Ra)
- Ultra Fine (32uin/0.8um Ra)

#### `part_marking_types`
Part marking options:
- Silkscreen
- Laser engraving

#### `inspection_types`
Inspection options:
- Standard Inspection (No report)
- Standard Inspection with Formal Report
- CMM Inspection with Formal Report
- Source Material Certification

#### `order_files`
Files associated with orders:
- Supports multiple files per order (up to 12)
- File categories: model, reference, instruction, result, technical_drawing, other
- File size stored as BIGINT to handle large files (up to 200MB)

## Row Level Security (RLS)

All tables have RLS enabled with the following policies:

### Public Read Access
- `manufacturing_processes` - Publicly readable
- `material_types` - Publicly readable
- `material_variants` - Publicly readable
- `surface_finishes` - Publicly readable
- `part_marking_types` - Publicly readable
- `inspection_types` - Publicly readable

### Admin-Only Write Access
Only users with 'admin' role can modify:
- `manufacturing_processes`
- `material_types`
- `material_variants`
- `surface_finishes`
- `part_marking_types`
- `inspection_types`

## How to Apply Migrations

### Option 1: Using Supabase CLI (Recommended)

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref tqkhoiiqqwaywnsmdgva

# Apply all migrations
supabase db push
```

### Option 2: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste each migration file in order
4. Execute each migration

### Option 3: Using psql (Direct Connection)

```bash
# Connect to your database
psql -h db.tqkhoiiqqwaywnsmdgva.supabase.co -U postgres -d postgres

# Run migrations
\i supabase/migrations/20250116000001_create_basic_tables.sql
\i supabase/migrations/20250116000002_enhance_order_system.sql
\i supabase/migrations/20250117000000_comprehensive_manufacturing_system.sql
\i supabase/migrations/20250117000001_fix_comprehensive_system.sql
```

## Verification

After applying migrations, verify the setup by:

1. Checking that all tables exist
2. Verifying RLS policies are enabled
3. Testing that the frontend can read from the new tables
4. Testing that orders can be created with all new fields

## Notes

- All migrations use `IF NOT EXISTS` and `ON CONFLICT DO NOTHING` to be idempotent
- The `order_files` table's `file_size` column is updated from INTEGER to BIGINT to handle large files
- All foreign key constraints are properly set up
- Indexes are created for performance optimization




