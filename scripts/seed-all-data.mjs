import fs from "node:fs";
import { neon } from "@neondatabase/serverless";

// 1. Chargement de DATABASE_URL depuis .env
const envText = fs.readFileSync(new URL("../.env", import.meta.url), "utf8");
const env = {};
for (const raw of envText.split(/\r?\n/)) {
  if (!raw || raw.startsWith("#") || !raw.includes("=")) continue;
  const i = raw.indexOf("=");
  env[raw.slice(0, i).trim()] = raw.slice(i + 1).trim().replace(/^\"|\"$/g, "");
}

if (!env.DATABASE_URL) {
  console.error("❌ ERREUR: DATABASE_URL non trouvée dans .env");
  process.exit(1);
}

const sql = neon(env.DATABASE_URL);

console.log("🌱 Début du peuplement de la base de données FSCPE avec 10 items par section...");

/* ==========================================================================
   DONNÉES SEED — 10 ITEMS AFRICAINS PAR SECTION ADMIN
   ========================================================================== */

// 1. ACTUALITÉS & BLOG (10 articles avec images africaines thématiques)
const NEWS_ITEMS = [
  {
    slug: "rentree-scolaire-solidaire-1200-kits-orphelins-conakry",
    title: "Rentrée Scolaire Solidaire : 1 200 kits complets distribués aux orphelins de Conakry",
    excerpt: "À l'occasion de la rentrée 2026, la Fondation Saran Camara a équipé 1 200 écoliers et collégiens de sacs neufs, uniformes et manuels scolaires dans les quartiers défavorisés de Conakry.",
    content: `À l'aube de chaque nouvelle année académique, l'achat des fournitures scolaires représente un obstacle insurmontable pour des centaines de familles monoparentales et tuteurs d'orphelins à Conakry. 

Face à ce constat alarmant, la Fondation Saran Camara pour la Protection de l'Enfance (FSCPE) a déployé son grand programme annuel « Un Cartable, Un Sourire ». Durant trois jours consécutifs, les équipes de bénévoles et les membres du bureau exécutif ont sillonné les communes de Matam, Dixinn et Ratoma pour distribuer des kits scolaires sur-mesure.

Chaque kit contenait :
- Un sac à dos ergonomique renforcé
- L'ensemble des cahiers et manuels au programme officiel guinéen
- Une trousse complète avec stylos, règles, compas et crayons
- Deux uniformes scolaires confectionnés par des ateliers locaux

« Voir le sourire et la fierté dans les yeux de ces enfants lorsqu'ils enfilent leur sac est notre plus belle récompense. Aucun enfant ne doit être exclu de l'école pour des raisons financières », a souligné Mme Saran Camara lors de la cérémonie officielle.`,
    coverImageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80",
    coverImagePublicId: "fscpe_seed_news_1",
    published: true,
    publishedAt: new Date(Date.now() - 2 * 86400000),
  },
  {
    slug: "inauguration-nouveau-centre-eveil-matam",
    title: "Inauguration du Centre d'Éveil et de Soutien Scolaire FSCPE à Matam Lido",
    excerpt: "Un espace moderne de 400 m² dédié au tutorat scolaire, à la lecture et à l'éveil psychomoteur des tout-petits orphelins a ouvert ses portes au cœur de Matam.",
    content: `C'est en présence des autorités communales, des chefs de quartiers et des partenaires associatifs que la Fondation Saran Camara a officiellement inauguré son nouveau Centre d'Éveil et d'Apprentissage Communautaire.

Ce tiers-lieu solidaire comprend :
1. Une bibliothèque jeunesse de plus de 1 500 ouvrages
2. Une salle d'étude surveillée avec 8 postes informatiques connectés
3. Un espace psychomoteur réservé aux 3-6 ans encadré par des éducateurs spécialisés
4. Une infirmerie de premier secours pour le suivi médical régulier

Le centre accueillera quotidiennement plus de 120 enfants après les heures de classe, leur offrant un environnement calme, sécurisé et stimulant pour réaliser leurs devoirs et développer leur créativité.`,
    coverImageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
    coverImagePublicId: "fscpe_seed_news_2",
    published: true,
    publishedAt: new Date(Date.now() - 5 * 86400000),
  },
  {
    slug: "campagne-nutritionnelle-800-familles-kindia",
    title: "Campagne Nutrition & Santé : 800 familles accompagnées dans la région de Kindia",
    excerpt: "Distribution de vivres riches en nutriments, farine fortifiée et ateliers culinaires pour lutter contre la malnutrition infantile chez les enfants de moins de 5 ans.",
    content: `La malnutrition chronique reste l'une des causes majeures de retard de croissance chez les jeunes enfants dans les zones périurbaines et rurales.

En partenariat avec des nutritionnistes locaux et le corps médical de Kindia, la mission FSCPE a organisé une distribution ciblée de paniers nutritionnels comprenant riz local, huile enrichie, légumineuses et compléments vitaminiques pour 800 foyers abritant des orphelins.

Des ateliers pratiques ont également été animés auprès des mères et tutrices pour enseigner la préparation de bouillies enrichies à base de produits agricoles locaux accessibles.`,
    coverImageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
    coverImagePublicId: "fscpe_seed_news_3",
    published: true,
    publishedAt: new Date(Date.now() - 10 * 86400000),
  },
  {
    slug: "journee-internationale-fille-plaidoyer-education-secondaire",
    title: "Journée de la Fille : Plaidoyer vibrant pour le maintien des jeunes filles à l'école",
    excerpt: "Conférence-débat et témoignages poignants à Conakry pour briser les barrières du mariage précoce et garantir l'accès au second cycle pour toutes les jeunes filles.",
    content: `À l'occasion de la Journée Internationale des Droits de la Fille, la FSCPE a réuni plus de 300 participantes : collégiennes, lycéennes, mères de famille et juristes.

Les échanges ont mis l'accent sur les solutions concrètes pour lutter contre la déscolarisation précoce des jeunes filles, trop souvent contraintes aux tâches domestiques ou aux unions précoces.

Mme Saran Camara a rappelé que chaque année passée sur les bancs de l'école augmente de manière décisive l'autonomie financière et la santé future de la jeune femme guinéenne.`,
    coverImageUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80",
    coverImagePublicId: "fscpe_seed_news_4",
    published: true,
    publishedAt: new Date(Date.now() - 15 * 86400000),
  },
  {
    slug: "caravane-medicale-mobile-soins-pediatriques-mamou",
    title: "Caravane Médicale Mobile : Soins pédiatriques gratuits pour 650 enfants de Mamou",
    excerpt: "Une équipe pluridisciplinaire de 8 médecins et infirmiers bénévoles a dispensé des consultations pédiatriques gratuites, dépistages et soins d'urgence.",
    content: `Pendant 48 heures, l'esplanade municipale de Mamou s'est transformée en hôpital de campagne pédiatrique grâce à la caravane médicale de la Fondation FSCPE.

Bilan des deux journées de consultation :
- 650 enfants auscultés
- 240 tests de dépistage rapide du paludisme effectués et traités
- 450 kits d'antiparasitaires et de vitamines distribués
- 18 enfants orientés vers les structures hospitalières régionales pour une prise en charge chirurgicale entièrement financée par la fondation.`,
    coverImageUrl: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=80",
    coverImagePublicId: "fscpe_seed_news_5",
    published: true,
    publishedAt: new Date(Date.now() - 20 * 86400000),
  },
  {
    slug: "programme-apprentissage-numerique-ordinateurs-orphelins",
    title: "Inclusion Numérique : 15 ordinateurs installés pour initier les orphelins au digital",
    excerpt: "Former les jeunes vulnérables aux métiers d'avenir grâce à un laboratoire informatique doté d'outils pédagogiques et d'une connexion internet sécurisée.",
    content: `Le fossé numérique ne doit pas condamner les enfants issus des milieux défavorisés à l'exclusion professionnelle.

Avec le soutien de ses mécènes technologiques, la FSCPE a équipé son premier FabLab d'apprentissage digital à destination des 12-18 ans. Les premiers modules portent sur la bureautique, la recherche documentaire sécurisée et l'initiation à la programmation visuelle.`,
    coverImageUrl: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1200&q=80",
    coverImagePublicId: "fscpe_seed_news_6",
    published: true,
    publishedAt: new Date(Date.now() - 25 * 86400000),
  },
  {
    slug: "protection-enfance-atelier-sensibilisation-violences",
    title: "Protection de l'Enfance : Atelier communautaire contre les violences et le travail précoce",
    excerpt: "Mobilisation des chefs de quartiers, imams et relais communautaires pour créer des cellules de veille et de signalement au bénéfice des enfants des rues.",
    content: `Protéger un enfant commence au niveau du quartier et du voisinage.

La FSCPE a orchestré un cycle de formation réunissant 45 leaders communautaires pour identifier les signaux faibles de maltraitance, de déscolarisation forcée ou d'exploitation économique des mineurs. Une ligne d'écoute et d'alerte locale a été mise en service.`,
    coverImageUrl: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1200&q=80",
    coverImagePublicId: "fscpe_seed_news_7",
    published: true,
    publishedAt: new Date(Date.now() - 30 * 86400000),
  },
  {
    slug: "distribution-vetements-moustiquaires-labe",
    title: "Action Solidaire à Labé : Vêtements, couvertures et moustiquaires pour l'hiver",
    excerpt: "Apport de chaleur et de confort aux enfants des orphelinats et familles précaires du Fouta-Djalon lors de la baisse des températures hivernales.",
    content: `Les nuits fraîches du Fouta-Djalon mettent à rude épreuve les plus fragiles.

La délégation FSCPE s'est rendue à Labé pour distribuer 500 couvertures polaires, 600 vêtements chauds et autant de moustiquaires imprégnées pour prévenir les pics saisonniers de paludisme.`,
    coverImageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    coverImagePublicId: "fscpe_seed_news_8",
    published: true,
    publishedAt: new Date(Date.now() - 35 * 86400000),
  },
  {
    slug: "bourse-excellence-saran-camara-25-filles-lycee",
    title: "Bourses d'Excellence FSCPE : 25 jeunes filles lauréates admises au lycée avec mention",
    excerpt: "Fierté et émotion lors de la remise des bourses d'études complètes récompensant les collégiennes orphelines aux résultats académiques exceptionnels.",
    content: `L'excellence académique comme levier d'émancipation : telle est la promesse tenue par la Bourse Saran Camara.

Vingt-cinq élèves issues des programmes d'accompagnement de la fondation ont brillamment décroché leur brevet et intègrent cette année les meilleurs lycées de la capitale avec la prise en charge de leurs frais de scolarité, transport et hébergement.`,
    coverImageUrl: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=1200&q=80",
    coverImagePublicId: "fscpe_seed_news_9",
    published: true,
    publishedAt: new Date(Date.now() - 40 * 86400000),
  },
  {
    slug: "bilan-annuel-impact-2025-4500-enfants-accompagnes",
    title: "Rapport d'Impact Annuel : Plus de 4 500 enfants accompagnés vers l'autonomie",
    excerpt: "Transparence, rigueur et solidarité : découvrez les chiffres clés, les réalisations sur le terrain et les défis à relever pour l'année à venir.",
    content: `L'année écoulée a marqué une étape historique pour la Fondation Saran Camara :
- 1 850 enfants scolarisés avec succès
- 1 400 consultations médicales et soins spécialisés prodigués
- 850 orphelins pris en charge dans nos foyers et familles d'accueil
- 98 % des dons alloués directement aux programmes de terrain.

La fondation remercie chaleureusement ses donateurs, mécènes et bénévoles pour leur confiance indéfectible.`,
    coverImageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
    coverImagePublicId: "fscpe_seed_news_10",
    published: true,
    publishedAt: new Date(Date.now() - 45 * 86400000),
  },
];

// 2. PROGRAMMES / PROJETS (10 programmes couvrant les 4 piliers)
const PROGRAM_ITEMS = [
  {
    slug: "un-cartable-un-avenir",
    title: "Un Cartable, Un Avenir : Bourses et kits scolaires",
    summary: "Financement intégral de la scolarité, des manuels scolaires et des uniformes pour permettre aux enfants orphelins de poursuivre leurs études dignement.",
    content: `Le programme « Un Cartable, Un Avenir » est le fer de lance de la fondation. En Guinée, des milliers d'enfants abandonnent l'école primaire dès le décès d'un parent en raison des frais annexes de scolarité.

Notre accompagnement comprend :
- L'inscription scolaire dans des établissements agréés et suivis
- Le versement direct des mensualités scolaires
- La dotation complète en manuels et cahiers au programme
- Le soutien scolaire hebdomadaire assuré par des enseignants volontaires
- Des bilans trimestriels pour prévenir tout décrochage.`,
    pillar: "education",
    beneficiariesCount: 1200,
    published: true,
    coverImageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
    coverImagePublicId: "fscpe_seed_prog_1",
  },
  {
    slug: "sante-sourires-pediatriques",
    title: "Santé & Sourires d'Enfants : Soins pédiatriques et dépistage",
    summary: "Consultations médicales gratuites, dépistage du paludisme et de la malnutrition, et prise en charge des chirurgies pédiatriques d'urgence.",
    content: `Garantir à chaque enfant le droit de grandir en bonne santé est une exigence absolue.

Le programme déploie des cliniques mobiles régulières dans les banlieues de Conakry et en province pour identifier précocement les pathologies pédiatriques : parasitoses, anémies, affections respiratoires et malformations congénitales.`,
    pillar: "social",
    beneficiariesCount: 950,
    published: true,
    coverImageUrl: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80",
    coverImagePublicId: "fscpe_seed_prog_2",
  },
  {
    slug: "nid-protecteur-orphelins",
    title: "Nid Protecteur : Hébergement d'urgence et familles d'accueil",
    summary: "Prise en charge globale, hébergement sécurisé, suivi psychologique et recherche de familles d'accueil bienveillantes pour orphelins sans soutien.",
    content: `Lorsqu'un enfant perd ses parents et se retrouve sans référent familial, le risque d'exploitation ou de dérive dans la rue est immédiat.

Le Nid Protecteur offre un toit d'accueil temporaire de qualité, une alimentation saine, des soins médicaux et un accompagnement psycho-social individualisé, tout en travaillant à une réinsertion familiale stable.`,
    pillar: "orphelins",
    beneficiariesCount: 320,
    published: true,
    coverImageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
    coverImagePublicId: "fscpe_seed_prog_3",
  },
  {
    slug: "halte-au-travail-des-enfants",
    title: "Halte au Travail des Enfants : Retrait des rues et réinsertion",
    summary: "Médiation, retrait des enfants des marchés et carrefours routiers, et formation qualifiante aux métiers de l'artisanat pour les adolescents.",
    content: `Travailler dès le plus jeune âge hypothèque tout espoir d'avenir.

La FSCPE coopère avec les services sociaux pour retirer les mineurs de l'exploitation économique et leur offrir une alternative concrète : retour à l'école pour les plus jeunes, ou ateliers d'apprentissage professionnel (menuiserie, couture, électricité) pour les plus grands.`,
    pillar: "protection",
    beneficiariesCount: 480,
    published: true,
    coverImageUrl: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1200&q=80",
    coverImagePublicId: "fscpe_seed_prog_4",
  },
  {
    slug: "cantines-scolaires-communautaires",
    title: "Cantines Solidaires : La nutrition au service de l'apprentissage",
    summary: "Fourniture quotidienne d'un déjeuner chaud et équilibré dans les écoles des quartiers vulnérables pour lutter contre la faim en classe.",
    content: `Un ventre vide ne peut pas apprendre. Dans de nombreuses écoles partenaires, les élèves parcourent plusieurs kilomètres à jeun.

Nos cantines solidaires approvisionnées en circuits courts auprès des productrices agricoles locales garantissent un apport calorique et vitaminique optimal, réduisant l'absentéisme de plus de 40 %.`,
    pillar: "social",
    beneficiariesCount: 1500,
    published: true,
    coverImageUrl: "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1200&q=80",
    coverImagePublicId: "fscpe_seed_prog_5",
  },
  {
    slug: "bourses-feminines-saran-camara",
    title: "Bourses Féminines d'Excellence : Autonomiser les filles par les études",
    summary: "Accompagnement intensif des jeunes filles méritantes du secondaire à l'université, avec mentorat de femmes leaders guinéennes.",
    content: `Favoriser le leadership féminin dès l'adolescence est l'un des piliers chers à notre fondatrice.

Le programme finance l'intégralité des frais de scolarité supérieure, le matériel pédagogique et associe chaque boursière à une marraine professionnelle pour faciliter son insertion sur le marché de l'emploi.`,
    pillar: "education",
    beneficiariesCount: 250,
    published: true,
    coverImageUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80",
    coverImagePublicId: "fscpe_seed_prog_6",
  },
  {
    slug: "eveil-petite-enfance-orphelins",
    title: "Éveil & Petite Enfance : Soins et tendresse pour les 0-5 ans",
    summary: "Espaces récréatifs, ateliers de stimulation cognitive et distribution de laits maternisés pour les nourrissons et tout-petits orphelins.",
    content: `Les 1 000 premiers jours d'un enfant sont fondamentaux pour son développement cérébral et affectif.

Nos éducateurs et puéricultrices dispensent des soins attentionnés et animent des activités d'éveil sensoriel adaptées aux bébés et jeunes enfants privés de leur mère biologique.`,
    pillar: "orphelins",
    beneficiariesCount: 180,
    published: true,
    coverImageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    coverImagePublicId: "fscpe_seed_prog_7",
  },
  {
    slug: "clinique-mobile-rurale-paludisme",
    title: "Clinique Mobile Rurale : Halte au paludisme et aux épidémies",
    summary: "Campagnes de vaccination itinérantes, distribution de moustiquaires imprégnées et sensibilisation aux gestes d'hygiène vitaux.",
    content: `Enclavées, de nombreuses communautés ne disposent d'aucun poste de santé à moins de 30 kilomètres.

Le véhicule tout-terrain médicalisé de la fondation transporte médicaments essentiels, tests de diagnostic rapide et vaccins pour toucher les enfants au plus près de leur foyer.`,
    pillar: "social",
    beneficiariesCount: 2100,
    published: true,
    coverImageUrl: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200&q=80",
    coverImagePublicId: "fscpe_seed_prog_8",
  },
  {
    slug: "numerique-et-codage-pour-tous",
    title: "Académie Digitale FSCPE : Le numérique comme tremplin d'avenir",
    summary: "Initiation aux outils informatiques, robotique et programmation pour donner aux orphelins des compétences professionnelles modernes.",
    content: `Le numérique est une opportunité historique d'égaliser les chances.

Ce programme dispense des cours pratiques d'informatique, de conception graphique et d'initiation au web dès la classe de 5ème, encadrés par des développeurs et ingénieurs bénévoles.`,
    pillar: "education",
    beneficiariesCount: 600,
    published: true,
    coverImageUrl: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1200&q=80",
    coverImagePublicId: "fscpe_seed_prog_9",
  },
  {
    slug: "assistance-juridique-et-etat-civil",
    title: "Droit à l'Identité : Rétablissement d'actes de naissance pour enfants invisibles",
    summary: "Procédures de jugement supplétif pour doter les orphelins d'un acte de naissance officiel, condition préalable à tout examen scolaire.",
    content: `Sans acte de naissance, un enfant n'existe pas légalement et ne peut se présenter aux examens nationaux.

L'équipe juridique de la FSCPE prend en charge les démarches administratives et judiciaires pour rétablir l'état civil de centaines d'enfants oubliés des registres.`,
    pillar: "protection",
    beneficiariesCount: 350,
    published: true,
    coverImageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80",
    coverImagePublicId: "fscpe_seed_prog_10",
  },
];

// 3. AGENDA & ÉVÉNEMENTS (10 événements réalistes en Guinée)
const EVENT_ITEMS = [
  {
    slug: "grande-ceremonie-remise-kits-scolaires-conakry",
    title: "Grande Cérémonie de Remise des Kits Scolaires - Rentrée 2026",
    description: "Cérémonie officielle en présence des donateurs et des autorités pour la remise de 1 200 cartables complets aux orphelins de la capitale.",
    location: "Esplanade du Palais du Peuple, Conakry",
    startAt: new Date(Date.now() + 5 * 86400000),
    endAt: new Date(Date.now() + 5 * 86400000 + 4 * 3600000),
    coverImageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80",
    published: true,
  },
  {
    slug: "caravane-medicale-depistage-gratuit-matam",
    title: "Caravane Médicale et Dépistage Pédiatrique Gratuit",
    description: "Consultations pédiatriques gratuites, dépistage du paludisme, soins dentaires et distribution de médicaments pédiatriques.",
    location: "Centre Communautaire de Matam Lido, Conakry",
    startAt: new Date(Date.now() + 12 * 86400000),
    endAt: new Date(Date.now() + 13 * 86400000),
    coverImageUrl: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=80",
    published: true,
  },
  {
    slug: "tournoi-football-solidarite-fraternite",
    title: "Tournoi de Football de la Fraternité et de l'Espoir",
    description: "Rencontre sportive réunissant les équipes d'enfants des orphelinats et des écoles de Conakry pour promouvoir le vivre-ensemble.",
    location: "Stade de Proximité de Coléah, Conakry",
    startAt: new Date(Date.now() + 18 * 86400000),
    endAt: new Date(Date.now() + 18 * 86400000 + 6 * 3600000),
    coverImageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    published: true,
  },
  {
    slug: "conference-droits-enfant-milieu-periurbain",
    title: "Table Ronde : Les Défis de la Protection de l'Enfance en Guinée",
    description: "Colloque d'experts, magistrats, éducateurs et associations pour renforcer la lutte contre les maltraitances et le travail des mineurs.",
    location: "Amphithéâtre Kofi Annan, Université Gamal Abdel Nasser",
    startAt: new Date(Date.now() + 25 * 86400000),
    endAt: new Date(Date.now() + 25 * 86400000 + 5 * 3600000),
    coverImageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80",
    published: true,
  },
  {
    slug: "distribution-alimentaire-ramadan-fetes-familles",
    title: "Opération Partage : Distribution de Colis Alimentaires pour 400 Familles",
    description: "Distribution de sacs de riz, sucre, huile et lait fortifié aux mères isolées et familles d'accueil d'orphelins.",
    location: "Siège de la Fondation FSCPE, Matam Lido",
    startAt: new Date(Date.now() + 32 * 86400000),
    endAt: new Date(Date.now() + 32 * 86400000 + 8 * 3600000),
    coverImageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
    published: true,
  },
  {
    slug: "atelier-robotique-initiation-numerique-jeunes",
    title: "Atelier Numérique : Premier Pas dans le Codage et la Robotique",
    description: "Initiation interactive pour 50 collégiens orphelins aux technologies numériques et à la pensée logique.",
    location: "Laboratoire Numérique Solidaire, Dixinn",
    startAt: new Date(Date.now() + 40 * 86400000),
    endAt: new Date(Date.now() + 40 * 86400000 + 4 * 3600000),
    coverImageUrl: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1200&q=80",
    published: true,
  },
  {
    slug: "camp-vacances-citoyen-kindia",
    title: "Séjour Pédagogique et Citoyen des Enfants à Kindia",
    description: "Une semaine d'immersion dans la nature, de visites culturelles et d'activités artistiques pour 60 orphelins méritants.",
    location: "Centre de Vacances de Kindia",
    startAt: new Date(Date.now() + 50 * 86400000),
    endAt: new Date(Date.now() + 57 * 86400000),
    coverImageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
    published: true,
  },
  {
    slug: "gala-caritatif-annuel-saran-camara",
    title: "Dîner de Gala et Vente Solidaire au Profit des Orphelins",
    description: "Soirée de bienfaisance réunissant les entreprises mécènes, diplomates et personnalités publiques pour lever des fonds d'urgence.",
    location: "Grand Hôtel Palm Camayenne, Conakry",
    startAt: new Date(Date.now() + 65 * 86400000),
    endAt: new Date(Date.now() + 65 * 86400000 + 4 * 3600000),
    coverImageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=80",
    published: true,
  },
  {
    slug: "journee-sensibilisation-hygiene-eau-potable",
    title: "Campagne Eau Propre & Hygiène en Milieu Scolaire",
    description: "Installation de points de lavage des mains et formation des élèves aux règles sanitaires pour prévenir le choléra.",
    location: "École Primaire Publique de Madina",
    startAt: new Date(Date.now() + 75 * 86400000),
    endAt: new Date(Date.now() + 75 * 86400000 + 4 * 3600000),
    coverImageUrl: "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1200&q=80",
    published: true,
  },
  {
    slug: "journee-portes-ouvertes-benevoles-fscpe",
    title: "Journée Portes Ouvertes : Rejoignez l'Aventure Humaine FSCPE",
    description: "Rencontre avec les équipes de terrain, témoignages d'anciens lauréats et ateliers d'intégration pour les nouveaux volontaires.",
    location: "Siège Social FSCPE, Matam Lido, Conakry",
    startAt: new Date(Date.now() + 90 * 86400000),
    endAt: new Date(Date.now() + 90 * 86400000 + 5 * 3600000),
    coverImageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
    published: true,
  },
];

// 4. TÉMOIGNAGES (10 avis inspirants de bénéficiaires et partenaires)
const TESTIMONIAL_ITEMS = [
  {
    authorName: "Mme Fatoumata Camara",
    authorRole: "Mère de 3 enfants orphelins, Conakry",
    quote: "Après la disparition tragique de mon époux, je ne savais pas comment mes trois enfants continueraient l'école. La FSCPE les a pris en charge avec amour et dignité. Aujourd'hui, mon aîné est premier de sa classe.",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    photoPublicId: "fscpe_seed_test_1",
    rating: 5,
    published: true,
  },
  {
    authorName: "Dr. Ousmane Sow",
    authorRole: "Médecin pédiatre bénévole, CHU de Conakry",
    quote: "Participer aux caravanes médicales mobiles de la fondation me rappelle la raison d'être de ma vocation. La rigueur organisationnelle et l'impact direct auprès des enfants sont tout simplement admirables.",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    photoPublicId: "fscpe_seed_test_2",
    rating: 5,
    published: true,
  },
  {
    authorName: "Mamadou Lamarana Bah",
    authorRole: "Étudiant en médecine, ancien boursier FSCPE",
    quote: "J'ai grandi dans la précarité la plus totale. Sans la bourse d'études accordée par Mme Saran Camara, je n'aurais jamais pu passer mon baccalauréat. Aujourd'hui, je m'apprête à devenir médecin pour soigner les miens.",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    photoPublicId: "fscpe_seed_test_3",
    rating: 5,
    published: true,
  },
  {
    authorName: "Mme Aissatou Diallo",
    authorRole: "Directrice de l'École Primaire de Matam",
    quote: "Depuis l'installation de la cantine scolaire et la fourniture des manuels par la FSCPE, notre taux d'assiduité a bondi de 35 %. Les enfants apprennent désormais avec enthousiasme et sérénité.",
    photoUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80",
    photoPublicId: "fscpe_seed_test_4",
    rating: 5,
    published: true,
  },
  {
    authorName: "Ibrahima Sory Bangoura",
    authorRole: "Bénévole engagé depuis 4 ans, Conakry",
    quote: "Être sur le terrain aux côtés de la fondation est une véritable leçon d'humanité. Chaque don collecté se transforme immédiatement en cahiers, repas ou médicaments sous nos yeux.",
    photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80",
    photoPublicId: "fscpe_seed_test_5",
    rating: 5,
    published: true,
  },
  {
    authorName: "Mariama Ciré Touré",
    authorRole: "Tutrice d'orphelins, Kindia",
    quote: "Lorsque j'ai recueilli mes deux neveux orphelins, mes revenus d'artisanat ne suffisaient pas. Le panier nutritionnel mensuel et le suivi médical de la FSCPE ont sauvé notre équilibre familial.",
    photoUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80",
    photoPublicId: "fscpe_seed_test_6",
    rating: 5,
    published: true,
  },
  {
    authorName: "Sékouba Kourouma",
    authorRole: "Responsable RSE d'un groupe télécoms partenaire",
    quote: "La transparence financière et la traçabilité des projets font de la FSCPE notre partenaire associatif de référence en Guinée. Nous savons exactement quel enfant bénéficie de chaque franc investi.",
    photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
    photoPublicId: "fscpe_seed_test_7",
    rating: 5,
    published: true,
  },
  {
    authorName: "Hadja Kadiatou Barry",
    authorRole: "Doyenne communautaire de Matam",
    quote: "Mme Saran Camara est une fille de notre quartier qui n'a jamais oublié d'où elle vient. La fondation est devenue le refuge bienveillant de toutes les mères en détresse.",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    photoPublicId: "fscpe_seed_test_8",
    rating: 5,
    published: true,
  },
  {
    authorName: "Abdoulaye Condé",
    authorRole: "Éducateur spécialisé en protection de l'enfance",
    quote: "Le travail d'écoute psychologique mené par l'équipe permet à ces jeunes orphelins de surmonter le deuil et de reprendre confiance en leurs capacités pour construire leur vie d'adulte.",
    photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
    photoPublicId: "fscpe_seed_test_9",
    rating: 5,
    published: true,
  },
  {
    authorName: "Binta Baldé",
    authorRole: "Collégienne de 14 ans, boursière FSCPE",
    quote: "Quand j'ai reçu mes livres neufs et mon cartable, j'ai pleuré de joie. Mon rêve est de devenir juge pour défendre tous les enfants qui souffrent en Guinée.",
    photoUrl: "https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&w=600&q=80",
    photoPublicId: "fscpe_seed_test_10",
    rating: 5,
    published: true,
  },
];

// 5. ÉQUIPE & GOUVERNANCE (10 membres africains avec fonctions et bios)
const TEAM_MEMBERS = [
  {
    fullName: "Mme Saran Camara",
    role: "Présidente & Fondatrice",
    bio: "Juriste et militante infatigable pour les droits fondamentaux des enfants, elle a consacré plus de 15 ans à la mise en place d'actions humanitaires concrètes en Guinée.",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    photoPublicId: "fscpe_seed_team_1",
    organBody: "fondatrice",
    displayOrder: 0,
  },
  {
    fullName: "M. Boubacar Diallo",
    role: "Vice-Président & Directeur des Opérations",
    bio: "Expert en gestion de projets de développement international, il supervise le déploiement opérationnel des programmes sur le terrain et la coordination logistique.",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    photoPublicId: "fscpe_seed_team_2",
    organBody: "bureau",
    displayOrder: 1,
  },
  {
    fullName: "Mme Mariama Diaby",
    role: "Secrétaire Générale",
    bio: "Diplômée en sciences politiques, elle assure la coordination institutionnelle, le suivi des dossiers juridiques et les relations avec les ministères de tutelle.",
    photoUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80",
    photoPublicId: "fscpe_seed_team_3",
    organBody: "bureau",
    displayOrder: 2,
  },
  {
    fullName: "M. Mohamed Lamine Sylla",
    role: "Trésorier Général & Auditeur Financier",
    bio: "Expert-comptable de formation, il garantit la conformité, la rigueur budgétaire et la transparence intégrale des flux financiers auprès des bailleurs de fonds.",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    photoPublicId: "fscpe_seed_team_4",
    organBody: "bureau",
    displayOrder: 3,
  },
  {
    fullName: "Dr. Kadiatou Kouyaté",
    role: "Médecin Coordonnatrice du Pôle Santé",
    bio: "Pédiatre urgentiste au CHU de Donka, elle pilote l'ensemble des caravanes médicales mobiles et les partenariats hospitaliers pour les enfants vulnérables.",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    photoPublicId: "fscpe_seed_team_5",
    organBody: "bureau",
    displayOrder: 4,
  },
  {
    fullName: "M. Amadou Tidiane Barry",
    role: "Responsable des Programmes Scolaires",
    bio: "Ancien inspecteur de l'éducation nationale, il sélectionne les écoles partenaires et coordonne la distribution des kits scolaires et le suivi pédagogique.",
    photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80",
    photoPublicId: "fscpe_seed_team_6",
    organBody: "bureau",
    displayOrder: 5,
  },
  {
    fullName: "Mme Fatou Bamba",
    role: "Responsable Communication & Événements",
    bio: "Spécialiste de la communication digitale et des médias, elle met en lumière les récits de terrain et anime les campagnes d'appel à la générosité publique.",
    photoUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80",
    photoPublicId: "fscpe_seed_team_7",
    organBody: "bureau",
    displayOrder: 6,
  },
  {
    fullName: "M. Cheick Oumar Traoré",
    role: "Membre du Conseil d'Administration & Avocat",
    bio: "Avocat inscrit au Barreau de Guinée, il apporte son expertise bénévole pour la protection judiciaire des mineurs et la médiation des litiges de tutelle.",
    photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
    photoPublicId: "fscpe_seed_team_8",
    organBody: "ca",
    displayOrder: 7,
  },
  {
    fullName: "Mme Aminata Keita",
    role: "Membre du Conseil d'Administration & Sociologue",
    bio: "Chercheuse en sciences sociales, elle veille à l'adéquation des programmes d'aide avec les réalités culturelles et coutumières des terroirs guinéens.",
    photoUrl: "https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&w=600&q=80",
    photoPublicId: "fscpe_seed_team_9",
    organBody: "ca",
    displayOrder: 8,
  },
  {
    fullName: "M. Alseny Bangoura",
    role: "Administrateur & Représentant des Familles Relais",
    bio: "Enseignant retraité et figure respectée du quartier Matam Lido, il assure le lien de proximité entre le conseil d'administration et les familles accompagnées.",
    photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
    photoPublicId: "fscpe_seed_team_10",
    organBody: "ca",
    displayOrder: 9,
  },
];

// 6. GALERIE PHOTOS (10 clichés professionnels par catégorie)
const GALLERY_ITEMS = [
  {
    title: "Distribution officielle des fournitures scolaires - École Primaire Matam",
    category: "education",
    imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80",
    imagePublicId: "fscpe_seed_gal_1",
  },
  {
    title: "Examen pédiatrique bienveillant lors de la caravane de santé",
    category: "sante",
    imageUrl: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=80",
    imagePublicId: "fscpe_seed_gal_2",
  },
  {
    title: "Sourires et fierté des enfants dans la nouvelle cour de récréation",
    category: "orphelinat",
    imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
    imagePublicId: "fscpe_seed_gal_3",
  },
  {
    title: "Séance studieuse de lecture partagée à la bibliothèque solidaire",
    category: "education",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
    imagePublicId: "fscpe_seed_gal_4",
  },
  {
    title: "Tournoi sportif inter-centres de la fraternité et de l'espoir",
    category: "evenements",
    imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    imagePublicId: "fscpe_seed_gal_5",
  },
  {
    title: "Acheminement d'urgence des colis nutritionnels aux familles de Kindia",
    category: "urgence",
    imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
    imagePublicId: "fscpe_seed_gal_6",
  },
  {
    title: "Campagne de vaccination et soins préventifs pour les tout-petits",
    category: "sante",
    imageUrl: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200&q=80",
    imagePublicId: "fscpe_seed_gal_7",
  },
  {
    title: "Atelier d'expression artistique et peinture avec les orphelins",
    category: "evenements",
    imageUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80",
    imagePublicId: "fscpe_seed_gal_8",
  },
  {
    title: "Découverte des ordinateurs dans la salle informatique FSCPE",
    category: "education",
    imageUrl: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1200&q=80",
    imagePublicId: "fscpe_seed_gal_9",
  },
  {
    title: "Repas chaud et équilibré à la cantine scolaire solidaire",
    category: "orphelinat",
    imageUrl: "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1200&q=80",
    imagePublicId: "fscpe_seed_gal_10",
  },
];

// 7. PARTENAIRES (10 partenaires institutionnels et humanitaires avec logos distincts)
const PARTNERS = [
  {
    name: "UNICEF Guinée",
    logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80",
    websiteUrl: "https://www.unicef.org/guinea",
    displayOrder: 1,
  },
  {
    name: "Plan International Guinée",
    logoUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=300&q=80",
    websiteUrl: "https://plan-international.org",
    displayOrder: 2,
  },
  {
    name: "Fondation Orange Guinée",
    logoUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=300&q=80",
    websiteUrl: "https://www.orange-guinee.com",
    displayOrder: 3,
  },
  {
    name: "Ministère de la Promotion Féminine et de l'Enfance",
    logoUrl: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=300&q=80",
    websiteUrl: "https://mpef.gov.gn",
    displayOrder: 4,
  },
  {
    name: "Save the Children Afrique de l'Ouest",
    logoUrl: "https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?auto=format&fit=crop&w=300&q=80",
    websiteUrl: "https://www.savethechildren.net",
    displayOrder: 5,
  },
  {
    name: "Croix-Rouge Guinéenne",
    logoUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=300&q=80",
    websiteUrl: "https://croixrouge.gn",
    displayOrder: 6,
  },
  {
    name: "Banque Islamique de Guinée (BIG)",
    logoUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=300&q=80",
    websiteUrl: "https://big-guinee.com",
    displayOrder: 7,
  },
  {
    name: "Société Générale Guinée",
    logoUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80",
    websiteUrl: "https://societegenerale.gn",
    displayOrder: 8,
  },
  {
    name: "TotalEnergies Marketing Guinée",
    logoUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=300&q=80",
    websiteUrl: "https://totalenergies.gn",
    displayOrder: 9,
  },
  {
    name: "Action Contre la Faim (ACF)",
    logoUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=300&q=80",
    websiteUrl: "https://www.actioncontrelafaim.org",
    displayOrder: 10,
  },
];

// 8. MESSAGES DE CONTACT (10 messages entrants pour tester l'admin)
const CONTACT_MESSAGES = [
  {
    name: "Dr. Alpha Mamadou Barry",
    email: "dr.barry.alpha@gmail.com",
    phone: "+224 622 45 78 90",
    subject: "Proposition de partenariat médical et journées de consultation bénévole",
    message: "Bonjour Mme Saran Camara et toute l'équipe FSCPE. En tant que médecin pédiatre exerçant à Conakry, je souhaiterais mettre mes compétences et celles de mes internes à disposition de vos prochaines caravanes médicales en province.",
    isRead: false,
    createdAt: new Date(Date.now() - 3600000 * 4),
  },
  {
    name: "Mme Mariama Ciré Sow",
    email: "mariama.sow@orange.com",
    phone: "+224 664 12 34 56",
    subject: "Demande d'informations pour le parrainage d'une jeune collégienne orpheline",
    message: "Bonjour, je souhaite parrainer annuellement la scolarité et les fournitures d'une orpheline jusqu'au baccalauréat. Pouvez-vous m'indiquer la procédure de parrainage et les modalités de virement ?",
    isRead: false,
    createdAt: new Date(Date.now() - 3600000 * 12),
  },
  {
    name: "M. Ibrahima Diallo",
    email: "diallo.ibrahima@bauxites.gn",
    phone: "+224 620 98 76 54",
    subject: "Mécénat d'entreprise - Rénovation de salles de classe",
    message: "Notre direction des relations communautaires aimerait financer la réhabilitation de deux salles de classe pour votre centre de soutien scolaire. Merci de nous contacter pour fixer une réunion.",
    isRead: false,
    createdAt: new Date(Date.now() - 3600000 * 24),
  },
  {
    name: "Fatoumata Binta Bah",
    email: "binta.bah@univ-conakry.edu.gn",
    phone: "+224 628 11 22 33",
    subject: "Candidature bénévole pour les cours du soir et soutien en mathématiques",
    message: "Étudiante en master de sciences à l'université de Conakry, je suis disponible tous les samedis pour dispenser des cours de soutien gratuits aux élèves de 3ème et terminale.",
    isRead: true,
    createdAt: new Date(Date.now() - 86400000 * 2),
  },
  {
    name: "Sékou Touré",
    email: "sekou.toure@diaspora-guinee.fr",
    phone: "+33 6 12 34 56 78",
    subject: "Don de matériel informatique depuis la diaspora en France",
    message: "Nous avons collecté 20 ordinateurs portables reconditionnés auprès d'entreprises en France et souhaitons les expédier par conteneur à votre fondation à Conakry.",
    isRead: true,
    createdAt: new Date(Date.now() - 86400000 * 3),
  },
  {
    name: "Hadja Aminata Kaba",
    email: "aminata.kaba@fondation.gn",
    phone: "+224 621 33 44 55",
    subject: "Invitation à intervenir au Forum National de la Protection Sociale",
    message: "Nous souhaiterions vivement que Mme Saran Camara prenne la parole lors de la table ronde d'ouverture consacrée à la résilience des orphelins en Guinée.",
    isRead: true,
    createdAt: new Date(Date.now() - 86400000 * 4),
  },
  {
    name: "Thierno Oumar Camara",
    email: "t.camara@kindia-agri.org",
    phone: "+224 660 77 88 99",
    subject: "Fourniture de denrées agricoles bio pour vos cantines scolaires",
    message: "Notre coopérative paysanne basée à Kindia peut vous fournir du riz local, de l'huile de palme artisanale et des tubercules à tarif préférentiel pour vos cantines.",
    isRead: true,
    createdAt: new Date(Date.now() - 86400000 * 5),
  },
  {
    name: "Aissata Kourouma",
    email: "aissata.k@gmail.com",
    phone: "+224 625 44 33 22",
    subject: "Signalement d'un cas d'enfant déscolarisé en grande vulnérabilité",
    message: "Bonjour, dans notre quartier à Matam, un jeune garçon de 9 ans a perdu ses deux parents et n'est plus scolarisé. Pouvez-vous envoyer un travailleur social pour évaluer la situation ?",
    isRead: true,
    createdAt: new Date(Date.now() - 86400000 * 6),
  },
  {
    name: "Mamadou Saliou Baldé",
    email: "saliou.balde@logistique.gn",
    phone: "+224 624 55 66 77",
    subject: "Mise à disposition gratuite de véhicules pour votre caravane médicale",
    message: "Notre agence de transport offre deux minibus et un chauffeur pour acheminer vos bénévoles et le matériel médical lors de votre prochaine mission à Labé.",
    isRead: true,
    createdAt: new Date(Date.now() - 86400000 * 7),
  },
  {
    name: "Kadiatou Bangoura",
    email: "kadi.bangoura@diplomatie.org",
    phone: "+224 623 99 88 77",
    subject: "Félicitations pour le rapport d'impact et promesse de contribution",
    message: "Nous avons lu avec beaucoup d'émotion votre rapport annuel d'activités. Votre dévouement sur le terrain force le respect. Notre collectif organise une collecte solidaire en votre faveur.",
    isRead: true,
    createdAt: new Date(Date.now() - 86400000 * 8),
  },
];

// 9. DONS RÉCENTS (10 transactions en GNF pour animer les KPI du dashboard)
const DONATIONS = [
  {
    reference: "DON-FSCPE-2026-001",
    donorName: "Mamadou Lamarana Diallo",
    donorEmail: "m.diallo@invest.gn",
    donorPhone: "+224 622 10 20 30",
    amount: 1500000, // 1 500 000 GNF
    currency: "GNF",
    provider: "geniuspay",
    paymentMethod: "orange_money",
    status: "success",
    createdAt: new Date(Date.now() - 3600000 * 3),
  },
  {
    reference: "DON-FSCPE-2026-002",
    donorName: "Aissatou Barry",
    donorEmail: "aissatou.barry@diaspora.fr",
    donorPhone: "+33 6 45 12 89 00",
    amount: 2500000, // 2 500 000 GNF
    currency: "GNF",
    provider: "geniuspay",
    paymentMethod: "card",
    status: "success",
    createdAt: new Date(Date.now() - 3600000 * 8),
  },
  {
    reference: "DON-FSCPE-2026-003",
    donorName: "Dr. Ibrahima Sory Camara",
    donorEmail: "dr.camara@sante.gov.gn",
    donorPhone: "+224 664 30 40 50",
    amount: 800000,
    currency: "GNF",
    provider: "geniuspay",
    paymentMethod: "mtn_money",
    status: "success",
    createdAt: new Date(Date.now() - 3600000 * 18),
  },
  {
    reference: "DON-FSCPE-2026-004",
    donorName: "Mariama Kourouma",
    donorEmail: "mariama.k@gmail.com",
    donorPhone: "+224 620 55 66 77",
    amount: 350000,
    currency: "GNF",
    provider: "geniuspay",
    paymentMethod: "wave",
    status: "success",
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    reference: "DON-FSCPE-2026-005",
    donorName: "Collectif Solidarité Matam",
    donorEmail: "collectif.matam@solidarite.gn",
    donorPhone: "+224 621 88 99 00",
    amount: 5000000, // 5 000 000 GNF
    currency: "GNF",
    provider: "geniuspay",
    paymentMethod: "orange_money",
    status: "success",
    createdAt: new Date(Date.now() - 86400000 * 2),
  },
  {
    reference: "DON-FSCPE-2026-006",
    donorName: "Boubacar Bah",
    donorEmail: "bouba.bah@tech.gn",
    donorPhone: "+224 628 33 22 11",
    amount: 450000,
    currency: "GNF",
    provider: "geniuspay",
    paymentMethod: "mtn_money",
    status: "success",
    createdAt: new Date(Date.now() - 86400000 * 3),
  },
  {
    reference: "DON-FSCPE-2026-007",
    donorName: "Fatoumata Binta Diallo",
    donorEmail: "binta.diallo@gmail.com",
    donorPhone: "+224 660 11 22 33",
    amount: 200000,
    currency: "GNF",
    provider: "geniuspay",
    paymentMethod: "orange_money",
    status: "pending",
    createdAt: new Date(Date.now() - 86400000 * 4),
  },
  {
    reference: "DON-FSCPE-2026-008",
    donorName: "Sékouba Condé",
    donorEmail: "sekou.conde@commerce.gn",
    donorPhone: "+224 625 77 88 99",
    amount: 1000000,
    currency: "GNF",
    provider: "geniuspay",
    paymentMethod: "wave",
    status: "success",
    createdAt: new Date(Date.now() - 86400000 * 5),
  },
  {
    reference: "DON-FSCPE-2026-009",
    donorName: "Hadja Mariama Sylla",
    donorEmail: "h.sylla@marche.gn",
    donorPhone: "+224 624 33 11 00",
    amount: 600000,
    currency: "GNF",
    provider: "geniuspay",
    paymentMethod: "orange_money",
    status: "success",
    createdAt: new Date(Date.now() - 86400000 * 6),
  },
  {
    reference: "DON-FSCPE-2026-010",
    donorName: "Ousmane Bangoura",
    donorEmail: "ousmane.b@yahoo.fr",
    donorPhone: "+224 623 44 55 66",
    amount: 750000,
    currency: "GNF",
    provider: "geniuspay",
    paymentMethod: "card",
    status: "success",
    createdAt: new Date(Date.now() - 86400000 * 7),
  },
];

// 10. ABONNÉS NEWSLETTER (10 abonnés réalistes pour la page newsletter admin)
const NEWSLETTER_SUBSCRIBERS = [
  { email: "fatoumata.diallo@gmail.com", source: "footer", daysAgo: 1 },
  { email: "amadou.sow@orange-guinee.com", source: "modal", daysAgo: 2 },
  { email: "mariama.camara@conakry-port.gn", source: "footer", daysAgo: 3 },
  { email: "ousmane.bah@yahoo.fr", source: "footer", daysAgo: 4 },
  { email: "kadiatou.bangoura@bauxites.gn", source: "actualites", daysAgo: 5 },
  { email: "boubacar.conde@finance.gov.gn", source: "footer", daysAgo: 6 },
  { email: "aissatou.toure@diaspora.fr", source: "don", daysAgo: 7 },
  { email: "sekouba.keita@univ-conakry.edu.gn", source: "footer", daysAgo: 8 },
  { email: "binta.sylla@commerce.gn", source: "modal", daysAgo: 9 },
  { email: "thierno.barry@solidarite-guinee.org", source: "footer", daysAgo: 10 },
];

/* ==========================================================================
   EXÉCUTION DU PEUPLEMENT
   ========================================================================== */

async function runSeed() {
  try {
    // Nettoyage préalable pour éviter les doublons de clés uniques (slugs, references)
    console.log("🧹 Nettoyage des anciennes données d'exemple...");
    await sql.query("DELETE FROM news");
    await sql.query("DELETE FROM programs");
    await sql.query("DELETE FROM events");
    await sql.query("DELETE FROM testimonials");
    await sql.query("DELETE FROM team_members");
    await sql.query("DELETE FROM gallery_images");
    await sql.query("DELETE FROM partners");
    await sql.query("DELETE FROM contact_messages");
    await sql.query("DELETE FROM donations");

    console.log("📥 Insertion des 10 Actualités / Articles...");
    for (const item of NEWS_ITEMS) {
      await sql.query(
        `INSERT INTO news (slug, title, excerpt, content, cover_image_url, cover_image_public_id, published, published_at, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8, $8)`,
        [item.slug, item.title, item.excerpt, item.content, item.coverImageUrl, item.coverImagePublicId, item.published, item.publishedAt]
      );
    }

    console.log("📥 Insertion des 10 Programmes & Piliers d'intervention...");
    for (const item of PROGRAM_ITEMS) {
      await sql.query(
        `INSERT INTO programs (slug, title, summary, content, cover_image_url, cover_image_public_id, pillar, beneficiaries_count, published)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [item.slug, item.title, item.summary, item.content, item.coverImageUrl, item.coverImagePublicId, item.pillar, item.beneficiariesCount, item.published]
      );
    }

    console.log("📥 Insertion des 10 Événements / Agenda...");
    for (const item of EVENT_ITEMS) {
      await sql.query(
        `INSERT INTO events (slug, title, description, location, start_at, end_at, cover_image_url, published)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [item.slug, item.title, item.description, item.location, item.startAt, item.endAt, item.coverImageUrl, item.published]
      );
    }

    console.log("📥 Insertion des 10 Témoignages & Avis...");
    for (const item of TESTIMONIAL_ITEMS) {
      await sql.query(
        `INSERT INTO testimonials (author_name, author_role, quote, photo_url, photo_public_id, rating, published)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [item.authorName, item.authorRole, item.quote, item.photoUrl, item.photoPublicId, item.rating, item.published]
      );
    }

    console.log("📥 Insertion des 10 Membres de la Gouvernance & Équipe...");
    for (const item of TEAM_MEMBERS) {
      await sql.query(
        `INSERT INTO team_members (full_name, role, bio, photo_url, photo_public_id, organ_body, display_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [item.fullName, item.role, item.bio, item.photoUrl, item.photoPublicId, item.organBody, item.displayOrder]
      );
    }

    console.log("📥 Insertion des 10 Photos de la Médiathèque / Galerie...");
    for (const item of GALLERY_ITEMS) {
      await sql.query(
        `INSERT INTO gallery_images (title, image_url, image_public_id, category)
         VALUES ($1, $2, $3, $4)`,
        [item.title, item.imageUrl, item.imagePublicId, item.category]
      );
    }

    console.log("📥 Insertion des 10 Partenaires humanitaires et institutionnels...");
    for (const item of PARTNERS) {
      await sql.query(
        `INSERT INTO partners (name, logo_url, website_url, display_order)
         VALUES ($1, $2, $3, $4)`,
        [item.name, item.logoUrl, item.websiteUrl, item.displayOrder]
      );
    }

    console.log("📥 Insertion des 10 Messages de contact de démonstration...");
    for (const item of CONTACT_MESSAGES) {
      await sql.query(
        `INSERT INTO contact_messages (name, email, phone, subject, message, is_read, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [item.name, item.email, item.phone, item.subject, item.message, item.isRead, item.createdAt]
      );
    }

    console.log("📥 Insertion des 10 Dons de démonstration pour le tableau de bord...");
    for (const item of DONATIONS) {
      await sql.query(
        `INSERT INTO donations (reference, donor_name, donor_email, donor_phone, amount, currency, provider, payment_method, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [item.reference, item.donorName, item.donorEmail, item.donorPhone, item.amount, item.currency, item.provider, item.paymentMethod, item.status, item.createdAt]
      );
    }

    console.log("📥 Insertion des 10 Abonnés Newsletter...");
    await sql.query("DELETE FROM settings WHERE key LIKE 'newsletter:%'");
    for (const sub of NEWSLETTER_SUBSCRIBERS) {
      const key = `newsletter:${sub.email}`;
      const payload = JSON.stringify({
        email: sub.email,
        subscribedAt: new Date(Date.now() - sub.daysAgo * 86400000).toISOString(),
        source: sub.source,
        ip: `154.124.64.${10 + sub.daysAgo}`,
      });
      await sql.query(
        `INSERT INTO settings (key, value, updated_at) VALUES ($1, $2, NOW())
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
        [key, payload]
      );
    }

    // Configurer l'affiche vidéo/hero avec une belle photo africaine haute résolution
    await sql.query(
      `INSERT INTO settings (key, value, updated_at)
       VALUES ('site_hero_poster_url', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1920&q=80', NOW())
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`
    );

    console.log("\n🎉 SUCCÈS : Base de données Neon peuplée avec succès avec 10 éléments africains par section !");
    console.log("📊 Récapitulatif :");
    console.log(" - Actualités / Blog : 10 articles");
    console.log(" - Programmes : 10 initiatives réparties sur les 4 piliers");
    console.log(" - Agenda / Événements : 10 rendez-vous planifiés");
    console.log(" - Témoignages : 10 avis authentiques");
    console.log(" - Équipe / Gouvernance : 10 membres");
    console.log(" - Galerie photos : 10 clichés HD");
    console.log(" - Partenaires : 10 partenaires");
    console.log(" - Messages reçus : 10 messages");
    console.log(" - Dons & Transactions : 10 dons");
    console.log(" - Abonnés Newsletter : 10 abonnés");
    console.log(" - Paramètres du site : Hero poster HD configuré");
  } catch (err) {
    console.error("❌ Erreur lors du peuplement de la base :", err);
    process.exit(1);
  }
}

runSeed();
