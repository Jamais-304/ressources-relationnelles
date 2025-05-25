import mongoose from 'mongoose';
import { MONGO_URI } from '../configs.ts';
import Category from '../models/Category.ts';
import RelationType from '../models/RelationType.ts';

const defaultCategories = [
    {
        name: 'sante_mentale',
        description: 'Ressources liées à la santé mentale, bien-être psychologique'
    },
    {
        name: 'sorties',
        description: 'Activités et sorties pour créer du lien social'
    },
    {
        name: 'bien_etre',
        description: 'Ressources pour le bien-être physique et mental'
    },
    {
        name: 'support_communautaire',
        description: 'Ressources d\'entraide et de support communautaire'
    },
    {
        name: 'ressources_professionnelles',
        description: 'Ressources pour l\'insertion professionnelle et l\'emploi'
    },
    {
        name: 'formation',
        description: 'Formations et apprentissages pour développer ses compétences'
    },
    {
        name: 'logement',
        description: 'Aide et ressources pour le logement'
    },
    {
        name: 'famille_parentalite',
        description: 'Ressources pour la famille et la parentalité'
    }
];

const defaultRelationTypes = [
    {
        name: 'family',
        displayName: 'Famille',
        description: 'Relations familiales - parents, enfants, fratrie...'
    },
    {
        name: 'friends',
        displayName: 'Amis',
        description: 'Relations amicales et amitiés'
    },
    {
        name: 'colleagues',
        displayName: 'Collègues',
        description: 'Relations professionnelles et collègues de travail'
    },
    {
        name: 'romantic',
        displayName: 'Relation amoureuse',
        description: 'Relations amoureuses et de couple'
    },
    {
        name: 'neighbors',
        displayName: 'Voisins',
        description: 'Relations de voisinage'
    },
    {
        name: 'community',
        displayName: 'Communauté',
        description: 'Relations communautaires et associatives'
    },
    {
        name: 'professional_support',
        displayName: 'Accompagnement professionnel',
        description: 'Relations avec les professionnels de l\'aide (psychologues, travailleurs sociaux...)'
    },
    {
        name: 'general',
        displayName: 'Relations en général',
        description: 'Conseils et ressources pour toutes types de relations'
    }
];

async function seedDatabase() {
    try {
        console.log('🌱 Connexion à la base de données...');
        await mongoose.connect(MONGO_URI, { dbName: process.env.DB_NAME });
        console.log('✅ Connexion réussie');

        // Seed Categories
        console.log('📂 Création des catégories...');
        for (const categoryData of defaultCategories) {
            const existingCategory = await Category.findOne({ name: categoryData.name });
            if (!existingCategory) {
                const category = new Category(categoryData);
                await category.save();
                console.log(`  ✅ Catégorie créée: ${categoryData.name}`);
            } else {
                console.log(`  ⏭️  Catégorie existante: ${categoryData.name}`);
            }
        }

        // Seed Relation Types
        console.log('🔗 Création des types de relations...');
        for (const relationTypeData of defaultRelationTypes) {
            const existingRelationType = await RelationType.findOne({ name: relationTypeData.name });
            if (!existingRelationType) {
                const relationType = new RelationType(relationTypeData);
                await relationType.save();
                console.log(`  ✅ Type de relation créé: ${relationTypeData.displayName}`);
            } else {
                console.log(`  ⏭️  Type de relation existant: ${relationTypeData.displayName}`);
            }
        }

        console.log('🎉 Seeding terminé avec succès!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Erreur lors du seeding:', error);
        process.exit(1);
    }
}

// Exécuter le seeding si ce fichier est appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
    seedDatabase();
}

export { seedDatabase }; 