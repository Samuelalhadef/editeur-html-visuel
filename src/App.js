import React, { useState, useRef, useEffect } from 'react';

function App() {
  const [htmlContent, setHtmlContent] = useState('');
  const [originalHTML, setOriginalHTML] = useState('');
  const [selectedElement, setSelectedElement] = useState(null);
  const [viewMode, setViewMode] = useState('edit');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingText, setEditingText] = useState('');
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('fr'); // 'fr' ou 'cz'
  const [isTranslating, setIsTranslating] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [fileError, setFileError] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [apiProvider, setApiProvider] = useState('huggingface'); // 'google', 'libretranslate', 'mymemory', 'huggingface'
  const [apiKey, setApiKey] = useState('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'); // Pour Google Translate et Hugging Face
  const [apiUrl, setApiUrl] = useState('https://libretranslate.de'); // URL LibreTranslate
  const [hfModel, setHfModel] = useState('facebook/m2m100_1.2B'); // Modèle Hugging Face
  const fileInputRef = useRef(null);
  const iframeRef = useRef(null);

  // Textes de l'interface en français et tchèque
  const texts = {
    fr: {
      title: "Éditeur de Texte HTML",
      subtitle: "Chambre de Commerce et d'Industrie de Prague",
      preview: "Mode Aperçu",
      edit: "Mode Édition",
      loadHtml: "Charger HTML",
      save: "Sauvegarder",
      export: "Exporter HTML",
      reset: "Réinitialiser",
      translate: "Traduction automatique",
      translating: "Traduction en cours...",
      useAPI: "Utiliser l'API Google Translate",
      useOffline: "Utiliser le dictionnaire local",
      translationMode: "Mode de traduction :",
      translateElement: "Traduire automatiquement",
      editing: "Éditer :",
      deselect: "Désélectionner",
      delete: "Supprimer",
      editDirectly: "Éditer directement sur la page",
      editingInProgress: "Édition en cours...",
      elementText: "Texte de l'élément :",
      formatting: "Formatage :",
      bold: "Gras",
      italic: "Italique",
      underline: "Souligné",
      left: "Gauche",
      center: "Centre",
      right: "Droite",
      textColor: "Couleur du texte :",
      backgroundColor: "Couleur de fond :",
      fontSize: "Taille de police :",
      htmlPreview: "Aperçu HTML :",
      instructions: "Instructions d'édition :",
      clickSelect: "Clic simple : Sélectionner un élément",
      doubleClickEdit: "Double-clic : Édition directe sur la page",
      panelEdit: "Panneau d'édition : Formatage avancé",
      enterValidate: "Entrée : Valider l'édition inline",
      escapeCancel: "Échap : Annuler l'édition inline",
      elementSelected: "Élément sélectionné :",
      editingNow: "Édition en cours - Tapez directement !",
      doubleClickTip: "Double-cliquez pour éditer directement sur la page",
      editMode: "Mode Édition de Texte",
      previewMode: "Mode Aperçu",
      editSubtitle: "Cliquez pour sélectionner, double-cliquez pour éditer directement le texte.",
      previewSubtitle: "Aperçu final sans outils d'édition.",
      noFileLoaded: "Aucun fichier chargé",
      loadFilePrompt: "Chargez un fichier HTML pour commencer l'édition",
      confirmDelete: "Confirmer la suppression",
      deleteConfirm: "Êtes-vous sûr de vouloir supprimer cet élément ?",
      cancel: "Annuler",
      stateSaved: "État sauvegardé !",
      fileLoading: "Chargement du fichier...",
      fileError: "Erreur de chargement",
      fileTooLarge: "Fichier trop volumineux (max 10MB)",
      fileFormat: "Format de fichier non supporté",
      fileRead: "Erreur de lecture du fichier",
      tryAgain: "Réessayer",
      fileDetails: "Détails du fichier :",
      fileName: "Nom :",
      fileSize: "Taille :",
      fileType: "Type :"
    },
    cz: {
      title: "HTML Textový Editor",
      subtitle: "Hospodářská komora a Hospodářská komora Praha",
      preview: "Režim náhledu",
      edit: "Režim úprav",
      loadHtml: "Načíst HTML",
      save: "Uložit",
      export: "Exportovat HTML",
      reset: "Resetovat",
      translate: "Automatický překlad",
      translating: "Překládání...",
      useAPI: "Použít Google Translate API",
      useOffline: "Použít místní slovník",
      translationMode: "Režim překladu:",
      translateElement: "Přeložit automaticky",
      editing: "Upravit:",
      deselect: "Zrušit výběr",
      delete: "Smazat",
      editDirectly: "Upravit přímo na stránce",
      editingInProgress: "Probíhá úprava...",
      elementText: "Text prvku:",
      formatting: "Formátování:",
      bold: "Tučné",
      italic: "Kurzíva",
      underline: "Podtržené",
      left: "Vlevo",
      center: "Na střed",
      right: "Vpravo",
      textColor: "Barva textu:",
      backgroundColor: "Barva pozadí:",
      fontSize: "Velikost písma:",
      htmlPreview: "Náhled HTML:",
      instructions: "Pokyny pro úpravy:",
      clickSelect: "Jedno kliknutí: Vybrat prvek",
      doubleClickEdit: "Dvojité kliknutí: Přímá úprava na stránce",
      panelEdit: "Panel úprav: Pokročilé formátování",
      enterValidate: "Enter: Potvrdit inline úpravu",
      escapeCancel: "Escape: Zrušit inline úpravu",
      elementSelected: "Vybraný prvek:",
      editingNow: "Probíhá úprava - Pište přímo!",
      doubleClickTip: "Dvojklikem můžete upravovat přímo na stránce",
      editMode: "Režim úprav textu",
      previewMode: "Režim náhledu",
      editSubtitle: "Klikněte pro výběr, dvojklikem pro přímou úpravu textu.",
      previewSubtitle: "Finální náhled bez nástrojů pro úpravy.",
      noFileLoaded: "Žádný soubor nebyl načten",
      loadFilePrompt: "Načtěte HTML soubor pro začátek úprav",
      confirmDelete: "Potvrdit smazání",
      deleteConfirm: "Jste si jisti, že chcete smazat tento prvek?",
      cancel: "Zrušit",
      stateSaved: "Stav uložen!",
      fileLoading: "Načítání souboru...",
      fileError: "Chyba při načítání",
      fileTooLarge: "Soubor je příliš velký (max 10MB)",
      fileFormat: "Nepodporovaný formát souboru",
      fileRead: "Chyba při čtení souboru",
      tryAgain: "Zkusit znovu",
      fileDetails: "Detaily souboru:",
      fileName: "Název:",
      fileSize: "Velikost:",
      fileType: "Typ:"
    }
  };

  const t = texts[currentLanguage];

  const retryFileLoad = () => {
    setFileError('');
    setFileLoading(false);
    setLoadingProgress(0);
    fileInputRef.current?.click();
  };

  const interfaceStyles = {
    appContainer: {
      display: 'flex',
      height: '100vh',
      backgroundColor: '#f3f4f6',
      fontFamily: 'Arial, sans-serif'
    },
    toolbar: {
      width: '360px',
      backgroundColor: 'white',
      borderRight: '1px solid #d1d5db',
      padding: '16px',
      overflowY: 'auto'
    },
    toolbarTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '16px',
      color: '#1f2937'
    },
    button: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      marginBottom: '8px',
      fontWeight: '500'
    },
    buttonPrimary: {
      backgroundColor: '#3b82f6',
      color: 'white'
    },
    buttonSuccess: {
      backgroundColor: '#10b981',
      color: 'white'
    },
    buttonSecondary: {
      backgroundColor: '#6b7280',
      color: 'white'
    },
    toggleButton: {
      backgroundColor: '#6366f1',
      color: 'white'
    },
    translateButton: {
      backgroundColor: '#f59e0b',
      color: 'white'
    },
    canvasContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f9fafb'
    },
    header: {
      padding: '16px',
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb'
    },
    pageTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '4px',
      color: '#1f2937'
    },
    pageSubtitle: {
      color: '#6b7280',
      fontSize: '14px'
    },
    htmlContainer: {
      flex: 1,
      overflow: 'hidden',
      backgroundColor: 'white',
      position: 'relative'
    },
    iframe: {
      width: '100%',
      height: '100%',
      border: 'none',
      backgroundColor: 'white'
    },
    hiddenInput: {
      display: 'none'
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      color: '#9ca3af',
      textAlign: 'center'
    },
    modeIndicator: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      background: viewMode === 'edit' ? '#3b82f6' : '#10b981',
      color: 'white',
      padding: '6px 12px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: 'bold',
      zIndex: 1000
    },
    editPanel: {
      marginTop: '16px',
      padding: '16px',
      backgroundColor: '#eff6ff',
      borderRadius: '8px',
      border: '1px solid #bfdbfe'
    },
    editTitle: {
      margin: '0 0 16px 0',
      color: '#1e40af',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '16px',
      fontWeight: 'bold'
    },
    deleteButton: {
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '6px 12px',
      cursor: 'pointer',
      fontSize: '12px'
    },
    inputGroup: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      fontWeight: 'bold',
      marginBottom: '6px',
      fontSize: '13px',
      color: '#374151'
    },
    input: {
      width: '100%',
      padding: '8px 10px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      transition: 'border-color 0.2s'
    },
    textarea: {
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      minHeight: '80px',
      resize: 'vertical',
      fontFamily: 'inherit',
      lineHeight: '1.5'
    },
    richTextarea: {
      width: '100%',
      padding: '12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      minHeight: '120px',
      resize: 'vertical',
      fontFamily: 'inherit',
      lineHeight: '1.6',
      backgroundColor: '#ffffff'
    },
    colorInputGroup: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center'
    },
    colorPicker: {
      width: '50px',
      height: '40px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      cursor: 'pointer'
    },
    sliderGroup: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center'
    },
    slider: {
      flex: 1
    },
    styleButtons: {
      display: 'flex',
      gap: '6px',
      flexWrap: 'wrap',
      marginBottom: '12px'
    },
    styleButton: {
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      backgroundColor: 'white',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    activeStyleButton: {
      backgroundColor: '#3b82f6',
      color: 'white',
      borderColor: '#3b82f6'
    },
    inlineEditButton: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '12px'
    },
    htmlPreview: {
      padding: '8px',
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '4px',
      fontSize: '12px',
      color: '#4b5563',
      maxHeight: '100px',
      overflow: 'auto'
    },
    languageSelector: {
      display: 'flex',
      gap: '4px',
      marginBottom: '16px'
    },
    languageButton: {
      flex: 1,
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '500',
      textAlign: 'center'
    },
    activeLanguageButton: {
      backgroundColor: '#3b82f6',
      color: 'white',
      borderColor: '#3b82f6'
    },
    inactiveLanguageButton: {
      backgroundColor: 'white',
      color: '#374151'
    },
    loadingIndicator: {
      padding: '12px',
      backgroundColor: '#e0f2fe',
      borderRadius: '6px',
      marginBottom: '8px',
      border: '1px solid #0ea5e9'
    },
    progressBar: {
      width: '100%',
      height: '4px',
      backgroundColor: '#e5e7eb',
      borderRadius: '2px',
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#3b82f6',
      transition: 'width 0.3s ease'
    },
    errorIndicator: {
      padding: '12px',
      backgroundColor: '#fef2f2',
      borderRadius: '6px',
      marginBottom: '8px',
      border: '1px solid #ef4444',
      color: '#b91c1c'
    },
    retryButton: {
      padding: '6px 12px',
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '12px'
    }
  };

  // Détection automatique de la langue
  const detectLanguage = async (text) => {
    if (!text || text.trim().length < 10) {
      // Pour les textes courts, essayer une détection basique
      const frenchWords = ['le', 'la', 'les', 'de', 'du', 'des', 'et', 'ou', 'avec', 'pour', 'dans', 'sur', 'par', 'sans'];
      const englishWords = ['the', 'and', 'or', 'with', 'for', 'in', 'on', 'by', 'without', 'from', 'to', 'at'];
      const czechWords = ['a', 'v', 'na', 'za', 'do', 'od', 'pro', 'se', 'ke', 'bez', 'mezi', 'před'];
      
      const words = text.toLowerCase().split(/\s+/);
      let frScore = 0, enScore = 0, czScore = 0;
      
      words.forEach(word => {
        if (frenchWords.includes(word)) frScore++;
        if (englishWords.includes(word)) enScore++;
        if (czechWords.includes(word)) czScore++;
      });
      
      if (frScore > enScore && frScore > czScore) return 'fr';
      if (enScore > frScore && enScore > czScore) return 'en';
      if (czScore > frScore && czScore > enScore) return 'cs';
      
      return 'auto'; // Inconnu
    }

    try {
      // Essayer la détection avec l'API
      if (apiProvider === 'libretranslate') {
        const response = await fetch(`${apiUrl}/detect`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ q: text.substring(0, 500) })
        });
        
        if (response.ok) {
          const result = await response.json();
          return result[0]?.language || 'auto';
        }
      }
      
      if (apiProvider === 'mymemory') {
        // MyMemory ne fait pas de détection, utiliser la détection basique
        return detectLanguage(text.substring(0, 100));
      }
      
      return 'auto';
    } catch (error) {
      console.warn('Erreur détection langue:', error);
      return 'auto';
    }
  };

  // Traduction avec Google Translate API
  const translateWithGoogle = async (text, targetLang, sourceLang = 'auto') => {
    if (!apiKey) {
      throw new Error('Clé API Google Translate manquante');
    }
    
    const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text'
      })
    });
    
    if (!response.ok) {
      throw new Error(`Erreur Google API: ${response.status}`);
    }
    
    const result = await response.json();
    return result.data.translations[0].translatedText;
  };

  // Traduction avec LibreTranslate (gratuit, open source)
  const translateWithLibreTranslate = async (text, targetLang, sourceLang = 'auto') => {
    const response = await fetch(`${apiUrl}/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang
      })
    });
    
    if (!response.ok) {
      throw new Error(`Erreur LibreTranslate: ${response.status}`);
    }
    
    const result = await response.json();
    return result.translatedText;
  };

  // Traduction avec MyMemory (gratuit avec limite)
  const translateWithMyMemory = async (text, targetLang, sourceLang = 'auto') => {
    const langPair = `${sourceLang}|${targetLang}`;
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`
    );
    
    if (!response.ok) {
      throw new Error(`Erreur MyMemory: ${response.status}`);
    }
    
    const result = await response.json();
    if (result.responseStatus === 200) {
      return result.responseData.translatedText;
    }
    
    throw new Error('Erreur MyMemory: ' + result.responseDetails);
  };

  // Traduction avec Hugging Face (modèles IA puissants)
  const translateWithHuggingFace = async (text, targetLang, sourceLang = 'auto') => {
    if (!apiKey) {
      throw new Error('Clé API Hugging Face manquante');
    }

    // Mapping des codes de langue pour les modèles Hugging Face
    const languageMapping = {
      'fr': 'fra_Latn',
      'en': 'eng_Latn', 
      'cs': 'ces_Latn',
      'auto': 'auto'
    };

    // Convertir les codes de langue
    const hfSourceLang = languageMapping[sourceLang] || sourceLang;
    const hfTargetLang = languageMapping[targetLang] || targetLang;

    let apiEndpoint;
    let requestBody;

    // Configuration selon le modèle choisi
    if (hfModel.includes('nllb')) {
      // Modèle NLLB (No Language Left Behind) - Meta
      apiEndpoint = `https://api-inference.huggingface.co/models/${hfModel}`;
      requestBody = {
        inputs: text,
        parameters: {
          src_lang: hfSourceLang === 'auto' ? 'fra_Latn' : hfSourceLang,
          tgt_lang: hfTargetLang
        }
      };
    } else if (hfModel.includes('m2m100')) {
      // Modèle M2M100 - Meta
      apiEndpoint = `https://api-inference.huggingface.co/models/${hfModel}`;
      requestBody = {
        inputs: text,
        parameters: {
          src_lang: hfSourceLang === 'auto' ? 'fr' : sourceLang,
          tgt_lang: targetLang
        }
      };
    } else if (hfModel.includes('opus-mt')) {
      // Modèles Helsinki-NLP opus-mt
      apiEndpoint = `https://api-inference.huggingface.co/models/${hfModel}`;
      requestBody = {
        inputs: text
      };
    } else {
      // Modèle générique
      apiEndpoint = `https://api-inference.huggingface.co/models/${hfModel}`;
      requestBody = {
        inputs: text,
        parameters: {
          source_language: sourceLang === 'auto' ? 'fr' : sourceLang,
          target_language: targetLang
        }
      };
    }

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Réponse Hugging Face:', errorText);
      
      if (response.status === 503) {
        throw new Error('Modèle en cours de chargement, réessayez dans 20 secondes');
      } else if (response.status === 401) {
        throw new Error('Clé API Hugging Face invalide ou expirée');
      } else if (response.status === 429) {
        throw new Error('Limite de taux dépassée, attendez un moment');
      } else {
        throw new Error(`Erreur Hugging Face ${response.status}: ${errorText.substring(0, 100)}`);
      }
    }

    const result = await response.json();
    
    // Gérer différents formats de réponse selon le modèle
    if (Array.isArray(result)) {
      return result[0]?.translation_text || result[0]?.generated_text || text;
    } else if (result.translation_text) {
      return result.translation_text;
    } else if (result.generated_text) {
      return result.generated_text;
    } else {
      throw new Error('Format de réponse Hugging Face inattendu');
    }
  };

  // Fonction principale de traduction avec détection automatique
  const translateText = async (text, targetLang = null) => {
    if (!text || text.trim() === '') return text;
    
    try {
      // Détecter la langue source
      const detectedLang = await detectLanguage(text);
      console.log(`🔍 Langue détectée: ${detectedLang} pour "${text.substring(0, 50)}..."`);
      
      // Déterminer la langue cible si pas spécifiée
      if (!targetLang) {
        if (detectedLang === 'fr') {
          targetLang = 'cs'; // Français → Tchèque
        } else if (detectedLang === 'en') {
          targetLang = 'cs'; // Anglais → Tchèque
        } else if (detectedLang === 'cs') {
          targetLang = 'fr'; // Tchèque → Français
        } else {
          // Pour langue inconnue, essayer de traduire vers tchèque
          targetLang = 'cs';
        }
      }
      
      // Si c'est déjà la bonne langue, essayer quand même la traduction
      console.log(`🔄 Traduction ${detectedLang} → ${targetLang}: "${text}"`);
      
      let translatedText;
      
      // Choisir l'API selon le provider
      switch (apiProvider) {
        case 'google':
          translatedText = await translateWithGoogle(text, targetLang, detectedLang);
          break;
        case 'libretranslate':
          translatedText = await translateWithLibreTranslate(text, targetLang, detectedLang);
          break;
        case 'mymemory':
          translatedText = await translateWithMyMemory(text, targetLang, detectedLang);
          break;
        case 'huggingface':
          translatedText = await translateWithHuggingFace(text, targetLang, detectedLang);
          break;
        default:
          throw new Error('Provider API non supporté');
      }
      
      console.log(`✅ Résultat: "${translatedText}"`);
      
      // Retourner la traduction même si elle semble identique
      return translatedText || text;
      
    } catch (error) {
      console.error('❌ Erreur traduction:', error);
      // Fallback: retourner le texte original
      return text;
    }
  };

  // Traduire tous les éléments avec langue forcée
  const translateAllTextForced = async (forcedTargetLang) => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument || isTranslating) return;

    setIsTranslating(true);

    try {
      const doc = iframe.contentDocument;
      
      // Sélectionner tous les éléments avec du texte visible
      const allElements = Array.from(doc.querySelectorAll('*'));
      const textElements = allElements.filter(element => {
        // Ignorer les éléments système
        if (['SCRIPT', 'STYLE', 'META', 'TITLE', 'LINK', 'HEAD'].includes(element.tagName)) {
          return false;
        }
        
        // Prendre seulement les éléments avec du texte direct (pas d'enfants HTML)
        const hasDirectText = element.childNodes.length > 0 && 
          Array.from(element.childNodes).some(node => 
            node.nodeType === Node.TEXT_NODE && 
            node.textContent.trim().length > 0
          );
          
        // Ou les éléments sans enfants avec du texte
        const isLeafWithText = element.children.length === 0 && 
          element.textContent.trim().length > 0;
          
        return hasDirectText || isLeafWithText;
      });

      console.log(`🔄 Traduction forcée vers ${forcedTargetLang}: ${textElements.length} éléments à traiter`);

      // Traduire chaque élément
      let translatedCount = 0;
      let totalProcessed = 0;
      
      for (let i = 0; i < textElements.length; i++) {
        const element = textElements[i];
        
        try {
          // Mettre à jour la progression
          const progress = Math.round(((i + 1) / textElements.length) * 100);
          setLoadingProgress(progress);
          
          if (element.children.length === 0) {
            // Élément simple sans enfants HTML
            const originalText = element.textContent.trim();
            if (originalText && originalText.length > 1) {
              totalProcessed++;
              console.log(`🔄 Force processing: "${originalText}" → ${forcedTargetLang}`);
              
              // Forcer la traduction vers la langue cible
              const translatedText = await translateTextForced(originalText, forcedTargetLang);
              console.log(`🔄 Force result: "${originalText}" → "${translatedText}"`);
              
              // Appliquer TOUJOURS la traduction et forcer le rerendering
              if (translatedText && translatedText.trim() !== '') {
                const oldText = element.textContent;
                element.textContent = translatedText;
                
                // Forcer la mise à jour visuelle
                element.style.display = 'none';
                void element.offsetHeight; // Force reflow
                element.style.display = '';
                
                translatedCount++;
                console.log(`✅ Force applied and rerendered: "${oldText}" → "${translatedText}"`);
              }
            }
          } else {
            // Élément avec enfants - traduire seulement les nœuds de texte directs
            const directTextNodes = Array.from(element.childNodes).filter(node => 
              node.nodeType === Node.TEXT_NODE && 
              node.textContent.trim().length > 1
            );
            
            for (const textNode of directTextNodes) {
              const originalText = textNode.textContent.trim();
              if (originalText && originalText.length > 1) {
                totalProcessed++;
                console.log(`🔄 Force processing node: "${originalText}" → ${forcedTargetLang}`);
                
                // Forcer la traduction vers la langue cible
                const translatedText = await translateTextForced(originalText, forcedTargetLang);
                console.log(`🔄 Force result node: "${originalText}" → "${translatedText}"`);
                
                // Appliquer TOUJOURS la traduction et forcer le rerendering
                if (translatedText && translatedText.trim() !== '') {
                  const oldText = textNode.textContent;
                  textNode.textContent = translatedText;
                  
                  // Forcer la mise à jour visuelle du parent
                  const parent = textNode.parentElement;
                  if (parent) {
                    parent.style.display = 'none';
                    void parent.offsetHeight; // Force reflow
                    parent.style.display = '';
                  }
                  
                  translatedCount++;
                  console.log(`✅ Force applied and rerendered node: "${oldText}" → "${translatedText}"`);
                }
              }
            }
          }
          
          // Petit délai entre les traductions pour éviter de surcharger l'API
          if (i % 3 === 0) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
        } catch (error) {
          console.warn(`⚠️ Erreur traduction forcée élément ${i}:`, error);
        }
      }

      console.log(`🎉 Traduction forcée terminée: ${translatedCount}/${totalProcessed} éléments traduits`);
      
      // Forcer une mise à jour complète de l'iframe
      setTimeout(() => {
        const currentHTML = doc.documentElement.outerHTML;
        const iframe = iframeRef.current;
        if (iframe) {
          iframe.srcdoc = `<!DOCTYPE html>\n${currentHTML}`;
        }
      }, 500);
      
      // Notification de succès
      const successMessage = `✅ Traduction forcée vers ${forcedTargetLang.toUpperCase()} terminée!\n` +
        `📊 ${translatedCount} éléments traduits sur ${totalProcessed} analysés\n` +
        `🌐 API utilisée: ${apiProvider.toUpperCase()}` +
        (apiProvider === 'huggingface' ? `\n🤗 Modèle: ${hfModel}` : '') +
        `\n🔄 L'iframe va se recharger automatiquement...`;
      
      alert(successMessage);
      
    } catch (error) {
      console.error('❌ Erreur lors de la traduction forcée:', error);
      alert(`Erreur lors de la traduction forcée: ${error.message}`);
    } finally {
      setIsTranslating(false);
      setLoadingProgress(0);
    }
  };

  // Fonction de traduction forcée (sans détection automatique)
  const translateTextForced = async (text, forcedTargetLang) => {
    if (!text || text.trim() === '') return text;
    
    try {
      console.log(`🔄 Traduction forcée: "${text}" → ${forcedTargetLang}`);
      
      let translatedText;
      
      // Choisir l'API selon le provider
      switch (apiProvider) {
        case 'google':
          translatedText = await translateWithGoogle(text, forcedTargetLang, 'auto');
          break;
        case 'libretranslate':
          translatedText = await translateWithLibreTranslate(text, forcedTargetLang, 'auto');
          break;
        case 'mymemory':
          translatedText = await translateWithMyMemory(text, forcedTargetLang, 'auto');
          break;
        case 'huggingface':
          translatedText = await translateWithHuggingFace(text, forcedTargetLang, 'auto');
          break;
        default:
          throw new Error('Provider API non supporté');
      }
      
      console.log(`✅ Résultat forcé: "${translatedText}"`);
      
      // Retourner la traduction
      return translatedText || text;
      
    } catch (error) {
      console.error('❌ Erreur traduction forcée:', error);
      // Fallback: retourner le texte original
      return text;
    }
  };
  const translateAllText = async () => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument || isTranslating) return;

    setIsTranslating(true);

    try {
      const doc = iframe.contentDocument;
      
      // Sélectionner tous les éléments avec du texte visible
      const allElements = Array.from(doc.querySelectorAll('*'));
      const textElements = allElements.filter(element => {
        // Ignorer les éléments système
        if (['SCRIPT', 'STYLE', 'META', 'TITLE', 'LINK', 'HEAD'].includes(element.tagName)) {
          return false;
        }
        
        // Prendre seulement les éléments avec du texte direct (pas d'enfants HTML)
        const hasDirectText = element.childNodes.length > 0 && 
          Array.from(element.childNodes).some(node => 
            node.nodeType === Node.TEXT_NODE && 
            node.textContent.trim().length > 0
          );
          
        // Ou les éléments sans enfants avec du texte
        const isLeafWithText = element.children.length === 0 && 
          element.textContent.trim().length > 0;
          
        return hasDirectText || isLeafWithText;
      });

      console.log(`🔄 Traduction automatique: ${textElements.length} éléments à traiter`);

      // Traduire chaque élément
      let translatedCount = 0;
      let totalProcessed = 0;
      
      for (let i = 0; i < textElements.length; i++) {
        const element = textElements[i];
        
        try {
          // Mettre à jour la progression
          const progress = Math.round(((i + 1) / textElements.length) * 100);
          setLoadingProgress(progress);
          
          if (element.children.length === 0) {
            // Élément simple sans enfants HTML
            const originalText = element.textContent.trim();
            if (originalText && originalText.length > 1) {
              totalProcessed++;
              console.log(`🔄 Processing: "${originalText}"`);
              const translatedText = await translateText(originalText);
              console.log(`🔄 Result: "${originalText}" → "${translatedText}"`);
              
              // Forcer la mise à jour du DOM
              if (translatedText && translatedText.trim() !== '' && translatedText !== originalText) {
                element.textContent = translatedText;
                // Forcer le rerendering
                element.style.display = 'none';
                void element.offsetHeight; // Force reflow
                element.style.display = '';
                translatedCount++;
                console.log(`✅ Applied and rerendered: "${originalText}" → "${translatedText}"`);
              }
            }
          } else {
            // Élément avec enfants - traduire seulement les nœuds de texte directs
            const directTextNodes = Array.from(element.childNodes).filter(node => 
              node.nodeType === Node.TEXT_NODE && 
              node.textContent.trim().length > 1
            );
            
            for (const textNode of directTextNodes) {
              const originalText = textNode.textContent.trim();
              if (originalText && originalText.length > 1) {
                totalProcessed++;
                console.log(`🔄 Processing node: "${originalText}"`);
                const translatedText = await translateText(originalText);
                console.log(`🔄 Result node: "${originalText}" → "${translatedText}"`);
                
                // Forcer la mise à jour du DOM
                if (translatedText && translatedText.trim() !== '' && translatedText !== originalText) {
                  textNode.textContent = translatedText;
                  // Forcer le rerendering du parent
                  const parent = textNode.parentElement;
                  if (parent) {
                    parent.style.display = 'none';
                    void parent.offsetHeight; // Force reflow
                    parent.style.display = '';
                  }
                  translatedCount++;
                  console.log(`✅ Applied and rerendered node: "${originalText}" → "${translatedText}"`);
                }
              }
            }
          }
          
          // Petit délai entre les traductions pour éviter de surcharger l'API
          if (i % 3 === 0) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
        } catch (error) {
          console.warn(`⚠️ Erreur traduction élément ${i}:`, error);
        }
      }

      // Traduire aussi les attributs importants
      console.log('🔄 Traduction des attributs...');
      const elementsWithAttributes = doc.querySelectorAll('[title], [alt], [placeholder]');
      for (const element of elementsWithAttributes) {
        if (element.title && element.title.trim().length > 1) {
          const originalTitle = element.title;
          const translatedTitle = await translateText(element.title);
          if (translatedTitle && translatedTitle.trim() !== '' && translatedTitle !== originalTitle) {
            element.title = translatedTitle;
            translatedCount++;
            console.log(`✅ Title: "${originalTitle}" → "${translatedTitle}"`);
          }
        }
        
        if (element.alt && element.alt.trim().length > 1) {
          const originalAlt = element.alt;
          const translatedAlt = await translateText(element.alt);
          if (translatedAlt && translatedAlt.trim() !== '' && translatedAlt !== originalAlt) {
            element.alt = translatedAlt;
            translatedCount++;
            console.log(`✅ Alt: "${originalAlt}" → "${translatedAlt}"`);
          }
        }
        
        if (element.placeholder && element.placeholder.trim().length > 1) {
          const originalPlaceholder = element.placeholder;
          const translatedPlaceholder = await translateText(element.placeholder);
          if (translatedPlaceholder && translatedPlaceholder.trim() !== '' && translatedPlaceholder !== originalPlaceholder) {
            element.placeholder = translatedPlaceholder;
            translatedCount++;
            console.log(`✅ Placeholder: "${originalPlaceholder}" → "${translatedPlaceholder}"`);
          }
        }
      }

      console.log(`🎉 Traduction terminée: ${translatedCount}/${totalProcessed} éléments traduits`);
      
      // Forcer une mise à jour complète de l'iframe
      setTimeout(() => {
        const currentHTML = doc.documentElement.outerHTML;
        const iframe = iframeRef.current;
        if (iframe) {
          iframe.srcdoc = `<!DOCTYPE html>\n${currentHTML}`;
        }
      }, 500);
      
      // Notification de succès
      const successMessage = `✅ Traduction automatique terminée!\n` +
        `📊 ${translatedCount} éléments traduits sur ${totalProcessed} analysés\n` +
        `🌐 API utilisée: ${apiProvider.toUpperCase()}` +
        (apiProvider === 'huggingface' ? `\n🤗 Modèle: ${hfModel}` : '') +
        `\n🔄 L'iframe va se recharger automatiquement...`;
      
      alert(successMessage);
      
    } catch (error) {
      console.error('❌ Erreur lors de la traduction:', error);
      alert(`Erreur lors de la traduction: ${error.message}`);
    } finally {
      setIsTranslating(false);
      setLoadingProgress(0);
    }
  };

  // Exporter le HTML modifié
  const exportHTML = () => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) return;

    const modifiedHTML = iframe.contentDocument.documentElement.outerHTML;
    const fullHTML = `<!DOCTYPE html>\n${modifiedHTML}`;

    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document-modifie.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Réinitialiser
  const resetPositions = () => {
    setHtmlContent(originalHTML);
    setSelectedElement(null);
    setEditingText('');
    setIsInlineEditing(false);
  };

  // Sauvegarder l'état
  const saveCurrentState = () => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) return;

    const currentHTML = iframe.contentDocument.documentElement.outerHTML;
    const fullHTML = `<!DOCTYPE html>\n${currentHTML}`;
    setHtmlContent(fullHTML);
    alert(t.stateSaved);
  };

  const handleFileLoad = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/html') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        setOriginalHTML(content);
        setHtmlContent(content);
        setSelectedElement(null);
        setEditingText('');
        setIsInlineEditing(false);
      };
      reader.readAsText(file);
    }
  };

  // Sélectionner un élément
  const selectElement = (element) => {
    // Désélectionner l'élément précédent
    if (selectedElement) {
      selectedElement.classList.remove('selected-element');
    }
    
    setSelectedElement(element);
    element.classList.add('selected-element');
    setEditingText(getElementText(element));
    setIsInlineEditing(false);
  };

  // Désélectionner l'élément
  const deselectElement = () => {
    if (selectedElement) {
      selectedElement.classList.remove('selected-element', 'inline-editing');
      selectedElement.removeAttribute('contenteditable');
    }
    setSelectedElement(null);
    setEditingText('');
    setIsInlineEditing(false);
  };

  // Initialiser l'iframe avec le contenu HTML
  useEffect(() => {
    const setupDocument = () => {
      const iframe = iframeRef.current;
      if (!iframe || !iframe.contentDocument) return;

      const doc = iframe.contentDocument;
      
      // Ajouter des styles pour l'édition
      const style = doc.createElement('style');
      style.textContent = `
        .editable-element {
          cursor: text;
          transition: all 0.2s ease;
          border-radius: 4px;
        }
        .editable-element:hover {
          outline: 2px dashed #3b82f6 !important;
          outline-offset: 2px;
          background-color: rgba(59, 130, 246, 0.05) !important;
        }
        .selected-element {
          outline: 3px solid #3b82f6 !important;
          outline-offset: 2px;
          background-color: rgba(59, 130, 246, 0.1) !important;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3) !important;
        }
        .inline-editing {
          outline: 3px solid #10b981 !important;
          outline-offset: 2px;
          background-color: rgba(16, 185, 129, 0.1) !important;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3) !important;
        }
      `;
      doc.head.appendChild(style);

      // Rendre tous les éléments éditables
      const elements = doc.querySelectorAll('*');
      elements.forEach(element => {
        if (['HTML', 'HEAD', 'BODY', 'SCRIPT', 'STYLE', 'META', 'TITLE', 'LINK'].includes(element.tagName)) {
          return;
        }

        element.classList.add('editable-element');
        
        // Événements de sélection
        element.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          selectElement(element);
        });

        // Double-clic pour édition inline
        element.addEventListener('dblclick', (e) => {
          e.stopPropagation();
          e.preventDefault();
          startInlineEditing(element);
        });
      });

      // Déselectionner en cliquant sur le body ou en dehors
      doc.addEventListener('click', (e) => {
        if (e.target === doc.body || !e.target.classList.contains('editable-element')) {
          deselectElement();
        }
      });
    };

    if (htmlContent && iframeRef.current) {
      const iframe = iframeRef.current;
      iframe.onload = () => {
        setupDocument();
      };
      iframe.srcdoc = htmlContent;
    }
  }, [htmlContent]); // eslint-disable-line react-hooks/exhaustive-deps

  // Obtenir le texte d'un élément de façon intelligente
  const getElementText = (element) => {
    // Si l'élément ne contient que du texte
    if (element.children.length === 0) {
      return element.textContent || '';
    }
    
    // Si l'élément contient d'autres éléments, récupérer le texte visible
    return element.innerText || element.textContent || '';
  };

  // Démarrer l'édition inline
  const startInlineEditing = (element) => {
    if (!element) element = selectedElement;
    if (!element) return;

    selectElement(element);
    setIsInlineEditing(true);
    element.classList.add('inline-editing');
    element.setAttribute('contenteditable', 'true');
    element.focus();

    // Sélectionner tout le texte
    const range = document.createRange();
    range.selectNodeContents(element);
    const selection = element.ownerDocument.defaultView.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    // Gérer les événements d'édition
    element.addEventListener('blur', stopInlineEditing);
    element.addEventListener('keydown', handleInlineKeydown);
  };

  // Arrêter l'édition inline
  const stopInlineEditing = () => {
    if (!selectedElement || !isInlineEditing) return;

    selectedElement.classList.remove('inline-editing');
    selectedElement.removeAttribute('contenteditable');
    selectedElement.removeEventListener('blur', stopInlineEditing);
    selectedElement.removeEventListener('keydown', handleInlineKeydown);
    
    // Mettre à jour le texte dans le panneau
    setEditingText(getElementText(selectedElement));
    setIsInlineEditing(false);
  };

  // Gérer les touches pendant l'édition inline
  const handleInlineKeydown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      stopInlineEditing();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      stopInlineEditing();
    }
  };

  // Mettre à jour le texte de l'élément
  const updateElementText = (newText) => {
    if (!selectedElement) return;
    
    // Si l'élément est simple (pas d'enfants HTML)
    if (selectedElement.children.length === 0) {
      selectedElement.textContent = newText;
    } else {
      // Préserver la structure HTML mais changer le texte principal
      const textNodes = getTextNodes(selectedElement);
      if (textNodes.length > 0) {
        textNodes[0].textContent = newText;
      } else {
        selectedElement.textContent = newText;
      }
    }
    
    setEditingText(newText);
  };

  // Obtenir les nœuds de texte d'un élément
  const getTextNodes = (element) => {
    const textNodes = [];
    const walker = element.ownerDocument.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    let node = walker.nextNode();
    while (node) {
      if (node.textContent.trim()) {
        textNodes.push(node);
      }
      node = walker.nextNode();
    }
    return textNodes;
  };

  // Mettre à jour les styles
  const updateElementStyle = (property, value) => {
    if (!selectedElement) return;
    selectedElement.style[property] = value;
  };

  // Obtenir la couleur du texte
  const getElementTextColor = () => {
    if (!selectedElement) return '#000000';
    const computed = selectedElement.ownerDocument.defaultView.getComputedStyle(selectedElement);
    return rgbToHex(computed.color) || '#000000';
  };

  // Obtenir la couleur de fond
  const getElementBackgroundColor = () => {
    if (!selectedElement) return '#ffffff';
    const computed = selectedElement.ownerDocument.defaultView.getComputedStyle(selectedElement);
    const bgColor = computed.backgroundColor;
    if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
      return '#ffffff';
    }
    return rgbToHex(bgColor) || '#ffffff';
  };

  // Obtenir la taille de police
  const getElementFontSize = () => {
    if (!selectedElement) return '16';
    const computed = selectedElement.ownerDocument.defaultView.getComputedStyle(selectedElement);
    return computed.fontSize.replace('px', '');
  };

  // Basculer un style
  const toggleElementStyle = (property, value1, value2) => {
    if (!selectedElement) return;
    const currentValue = selectedElement.style[property];
    selectedElement.style[property] = currentValue === value1 ? value2 : value1;
  };

  // Appliquer l'alignement
  const setElementAlignment = (alignment) => {
    if (!selectedElement) return;
    selectedElement.style.textAlign = alignment;
  };

  // Supprimer l'élément
  const deleteSelectedElement = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (selectedElement) {
      selectedElement.remove();
      setSelectedElement(null);
      setEditingText('');
      setIsInlineEditing(false);
    }
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  // Convertir RGB en HEX
  const rgbToHex = (rgb) => {
    if (!rgb) return null;
    if (rgb.charAt(0) === '#') return rgb;
    
    const result = rgb.match(/\d+/g);
    if (!result) return null;
    
    const r = parseInt(result[0]);
    const g = parseInt(result[1]);
    const b = parseInt(result[2]);
    
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  // Traduire un élément individuel avec détection automatique
  const translateSelectedElement = async () => {
    if (!selectedElement || isTranslating) return;
    
    setIsTranslating(true);
    
    try {
      const originalText = getElementText(selectedElement);
      console.log(`🔄 Traduction élément: "${originalText}"`);
      
      const translatedText = await translateText(originalText);
      
      console.log(`✅ Résultat: "${translatedText}"`);
      
      if (translatedText && translatedText !== originalText) {
        updateElementText(translatedText);
        
        const message = `✅ Élément traduit automatiquement:\n"${originalText}" → "${translatedText}"`;
        alert(message);
      } else {
        const message = `⚠️ Aucune traduction nécessaire ou possible pour: "${originalText}"`;
        alert(message);
      }
      
    } catch (error) {
      console.error('❌ Erreur traduction élément:', error);
      alert(`Erreur lors de la traduction: ${error.message}`);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div style={interfaceStyles.appContainer}>
      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
            maxWidth: '400px',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#1f2937' }}>{t.confirmDelete}</h3>
            <p style={{ margin: '0 0 24px 0', color: '#6b7280' }}>
              {t.deleteConfirm}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={cancelDelete} style={{
                padding: '8px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: 'white',
                color: '#374151',
                cursor: 'pointer'
              }}>
                {t.cancel}
              </button>
              <button onClick={confirmDelete} style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: '#ef4444',
                color: 'white',
                cursor: 'pointer'
              }}>
                {t.delete}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barre d'outils */}
      <div style={interfaceStyles.toolbar}>
        <h2 style={interfaceStyles.toolbarTitle}>{t.title}</h2>
        <p style={interfaceStyles.toolbarSubtitle}>{t.subtitle}</p>
        
        {/* Sélecteur de langue */}
        <div style={interfaceStyles.languageSelector}>
          <button
            onClick={() => setCurrentLanguage('fr')}
            style={{
              ...interfaceStyles.languageButton,
              ...(currentLanguage === 'fr' ? interfaceStyles.activeLanguageButton : interfaceStyles.inactiveLanguageButton)
            }}
          >
            🇫🇷 Français
          </button>
          <button
            onClick={() => setCurrentLanguage('cz')}
            style={{
              ...interfaceStyles.languageButton,
              ...(currentLanguage === 'cz' ? interfaceStyles.activeLanguageButton : interfaceStyles.inactiveLanguageButton)
            }}
          >
            🇨🇿 Čeština
          </button>
        </div>

        {/* Configuration API de traduction */}
        <div style={{
          marginBottom: '16px',
          padding: '12px',
          backgroundColor: '#f1f5f9',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <label style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: '#1e40af'
          }}>
            🌐 API de traduction :
          </label>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
              <input
                type="radio"
                name="apiProvider"
                checked={apiProvider === 'huggingface'}
                onChange={() => setApiProvider('huggingface')}
              />
              🤗 Hugging Face (IA Puissante)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
              <input
                type="radio"
                name="apiProvider"
                checked={apiProvider === 'libretranslate'}
                onChange={() => setApiProvider('libretranslate')}
              />
              🆓 LibreTranslate (Gratuit)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
              <input
                type="radio"
                name="apiProvider"
                checked={apiProvider === 'mymemory'}
                onChange={() => setApiProvider('mymemory')}
              />
              🆓 MyMemory (Gratuit, limité)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
              <input
                type="radio"
                name="apiProvider"
                checked={apiProvider === 'google'}
                onChange={() => setApiProvider('google')}
              />
              💰 Google Translate (Payant)
            </label>
          </div>
          
          {/* Configuration spécifique selon l'API */}
          {apiProvider === 'huggingface' && (
            <div style={{ marginTop: '8px' }}>
              <input
                type="text"
                placeholder="Clé API Hugging Face (gratuite)"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  fontSize: '11px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  marginBottom: '8px'
                }}
              />
              <select
                value={hfModel}
                onChange={(e) => setHfModel(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  fontSize: '11px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  marginBottom: '4px'
                }}
              >
                <option value="facebook/m2m100_1.2B">M2M100-1.2B (Sélectionné)</option>
                <option value="facebook/nllb-200-distilled-600M">🔥 NLLB-200 (Recommandé)</option>
                <option value="facebook/m2m100_418M">M2M100-418M (Rapide)</option>
                <option value="Helsinki-NLP/opus-mt-fr-cs">Opus FR→CS</option>
                <option value="Helsinki-NLP/opus-mt-cs-fr">Opus CS→FR</option>
                <option value="Helsinki-NLP/opus-mt-en-cs">Opus EN→CS</option>
                <option value="Helsinki-NLP/opus-mt-cs-en">Opus CS→EN</option>
              </select>
              <p style={{ fontSize: '10px', color: '#6b7280', margin: '4px 0 0 0' }}>
                🆓 Gratuit avec compte HF • Obtenez votre clé sur huggingface.co/settings/tokens<br/>
                <strong>Étapes :</strong> 1) Créez un compte gratuit 2) Générez un token 3) Collez-le ici
              </p>
            </div>
          )}
          
          {apiProvider === 'google' && (
            <div style={{ marginTop: '8px' }}>
              <input
                type="text"
                placeholder="Clé API Google Translate"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  fontSize: '11px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  marginTop: '4px'
                }}
              />
              <p style={{ fontSize: '10px', color: '#6b7280', margin: '4px 0 0 0' }}>
                Obtenez votre clé sur Google Cloud Console
              </p>
            </div>
          )}
          
          {apiProvider === 'libretranslate' && (
            <div style={{ marginTop: '8px' }}>
              <input
                type="text"
                placeholder="URL LibreTranslate"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  fontSize: '11px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  marginTop: '4px'
                }}
              />
              <p style={{ fontSize: '10px', color: '#6b7280', margin: '4px 0 0 0' }}>
                Par défaut: https://libretranslate.de
              </p>
            </div>
          )}
          
          {apiProvider === 'mymemory' && (
            <p style={{ fontSize: '10px', color: '#6b7280', margin: '8px 0 0 0' }}>
              ⚠️ Limité à 1000 caractères/jour sans clé API
            </p>
          )}
        </div>

        {/* Informations sur les modèles Hugging Face */}
        {apiProvider === 'huggingface' && (
          <div style={{
            marginBottom: '16px',
            padding: '12px',
            backgroundColor: '#f0f9ff',
            borderRadius: '8px',
            border: '1px solid #0ea5e9'
          }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 'bold',
              marginBottom: '8px',
              color: '#0369a1'
            }}>
              🤗 Informations sur les modèles :
            </label>
            <div style={{ fontSize: '10px', color: '#0c4a6e', lineHeight: '1.4' }}>
              <strong>• NLLB-200</strong> : Meta AI, supporte 200+ langues, excellent pour FR/EN/CS<br/>
              <strong>• M2M100</strong> : Meta AI, modèle multilingue, très bon pour toutes les langues<br/>
              <strong>• Opus-MT</strong> : Helsinki-NLP, spécialisé par paire de langues, très précis<br/>
              <br/>
              <strong>💡 Conseil :</strong> NLLB-200 est recommandé pour sa qualité exceptionnelle !
            </div>
          </div>
        )}

        {/* Bouton de test de détection de langue */}
        {htmlContent && (
          <button
            style={{
              ...interfaceStyles.button, 
              backgroundColor: '#8b5cf6',
              color: 'white',
              fontSize: '12px',
              marginBottom: '8px'
            }}
            onClick={async () => {
              console.log('🧪 Test de détection et traduction avec', apiProvider.toUpperCase());
              if (apiProvider === 'huggingface') {
                console.log('🤗 Modèle utilisé:', hfModel);
              }
              
              const testTexts = [
                'Hello, how are you today?',
                'Bonjour, comment allez-vous?',
                'Dobrý den, jak se máte?',
                'Welcome to our website',
                'Bienvenue sur notre site',
                'Vítejte na našich webových stránkách'
              ];
              
              for (const text of testTexts) {
                try {
                  const detectedLang = await detectLanguage(text);
                  const translation = await translateText(text);
                  console.log(`"${text}" → [${detectedLang}] → "${translation}"`);
                } catch (error) {
                  console.error(`Erreur pour "${text}":`, error.message);
                }
              }
              
              const summary = apiProvider === 'huggingface' 
                ? `Test terminé avec ${hfModel}! Vérifiez la console pour les résultats.`
                : 'Test terminé, vérifiez la console';
              alert(summary);
            }}
          >
            🧪 Tester {apiProvider === 'huggingface' ? `${hfModel.split('/')[1]}` : 'détection & traduction'}
          </button>
        )}

        {/* Bouton de traduction automatique */}
        {htmlContent && (
          <button
            style={{...interfaceStyles.button, ...interfaceStyles.translateButton}}
            onClick={translateAllText}
            disabled={isTranslating}
          >
            🌐 {isTranslating ? `${t.translating} ${loadingProgress}%` : t.translate}
          </button>
        )}

        {/* Boutons de traduction forcée */}
        {htmlContent && (
          <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
            <button
              style={{
                ...interfaceStyles.button,
                backgroundColor: '#16a34a',
                color: 'white',
                fontSize: '12px',
                padding: '8px 12px'
              }}
              onClick={() => translateAllTextForced('cs')}
              disabled={isTranslating}
            >
              🇨🇿 Force → Tchèque
            </button>
            <button
              style={{
                ...interfaceStyles.button,
                backgroundColor: '#2563eb',
                color: 'white',
                fontSize: '12px',
                padding: '8px 12px'
              }}
              onClick={() => translateAllTextForced('fr')}
              disabled={isTranslating}
            >
              🇫🇷 Force → Français
            </button>
          </div>
        )}

        {/* Barre de progression traduction */}
        {isTranslating && (
          <div style={{
            ...interfaceStyles.loadingIndicator,
            backgroundColor: '#fef3c7',
            border: '1px solid #f59e0b'
          }}>
            <div style={{ fontSize: '12px', marginBottom: '4px' }}>
              {t.translating} {loadingProgress}%
            </div>
            <div style={interfaceStyles.progressBar}>
              <div 
                style={{
                  ...interfaceStyles.progressFill,
                  backgroundColor: '#f59e0b',
                  width: `${loadingProgress}%`
                }}
              />
            </div>
            <div style={{ fontSize: '10px', marginTop: '4px', color: '#92400e' }}>
              🌐 API: {apiProvider.toUpperCase()} 
              {apiProvider === 'huggingface' && ` (${hfModel.split('/')[1]})`} - Détection automatique
            </div>
          </div>
        )}
        
        {/* Boutons de debug */}
        {htmlContent && (
          <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
            <button
              style={{
                ...interfaceStyles.button,
                backgroundColor: '#7c3aed',
                color: 'white',
                fontSize: '11px',
                padding: '6px 8px'
              }}
              onClick={() => {
                const iframe = iframeRef.current;
                if (iframe && iframe.contentDocument) {
                  const doc = iframe.contentDocument;
                  const allText = doc.body.innerText;
                  console.log('📄 Contenu actuel de l\'iframe:', allText);
                  
                  // Analyser les éléments textuels
                  const textElements = Array.from(doc.querySelectorAll('*')).filter(el => 
                    el.children.length === 0 && el.textContent.trim().length > 0
                  );
                  console.log('📊 Éléments textuels trouvés:', textElements.length);
                  textElements.forEach((el, i) => {
                    console.log(`${i+1}. ${el.tagName}: "${el.textContent.trim()}"`);
                  });
                  
                  alert(`Debug: ${textElements.length} éléments textuels trouvés. Vérifiez la console.`);
                }
              }}
            >
              🔍 Debug iframe
            </button>
            <button
              style={{
                ...interfaceStyles.button,
                backgroundColor: '#dc2626',
                color: 'white',
                fontSize: '11px',
                padding: '6px 8px'
              }}
              onClick={() => {
                const iframe = iframeRef.current;
                if (iframe && iframe.contentDocument) {
                  const currentHTML = iframe.contentDocument.documentElement.outerHTML;
                  iframe.srcdoc = `<!DOCTYPE html>\n${currentHTML}`;
                  alert('Iframe rechargée manuellement !');
                }
              }}
            >
              🔄 Recharger iframe
            </button>
          </div>
        )}

        {/* Explication des modes de traduction */}
        {htmlContent && (
          <div style={{
            marginBottom: '16px',
            padding: '8px',
            backgroundColor: '#fef3c7',
            borderRadius: '6px',
            border: '1px solid #f59e0b',
            fontSize: '10px',
            color: '#92400e'
          }}>
            <strong>💡 Modes de traduction :</strong><br/>
            • <strong>Automatique</strong> : Détecte la langue et traduit intelligemment<br/>
            • <strong>Force</strong> : Traduit TOUT vers la langue choisie (ignorer la détection)
          </div>
        )}

        {/* Bouton de mode */}
        <button
          style={{...interfaceStyles.button, ...interfaceStyles.toggleButton}}
          onClick={() => setViewMode(viewMode === 'edit' ? 'preview' : 'edit')}
        >
          {viewMode === 'edit' ? '👁️' : '💻'} {viewMode === 'edit' ? t.preview : t.edit}
        </button>

        {/* Import/Export */}
        <button
          style={{...interfaceStyles.button, ...interfaceStyles.buttonPrimary}}
          onClick={() => fileInputRef.current?.click()}
          disabled={fileLoading}
        >
          ⬆️ {fileLoading ? t.fileLoading : t.loadHtml}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".html,.htm,.xhtml,.txt"
          onChange={handleFileLoad}
          style={interfaceStyles.hiddenInput}
        />

        {/* Indicateur de chargement */}
        {fileLoading && (
          <div style={interfaceStyles.loadingIndicator}>
            <div style={{ fontSize: '12px', marginBottom: '4px' }}>
              {t.fileLoading} {loadingProgress}%
            </div>
            <div style={interfaceStyles.progressBar}>
              <div 
                style={{
                  ...interfaceStyles.progressFill,
                  width: `${loadingProgress}%`
                }}
              />
            </div>
          </div>
        )}

        {/* Indicateur d'erreur */}
        {fileError && (
          <div style={interfaceStyles.errorIndicator}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
              {t.fileError}
            </div>
            <div style={{ fontSize: '12px', marginBottom: '8px' }}>
              {fileError}
            </div>
            <button onClick={retryFileLoad} style={interfaceStyles.retryButton}>
              {t.tryAgain}
            </button>
          </div>
        )}

        {htmlContent && (
          <>
            <button
              style={{...interfaceStyles.button, ...interfaceStyles.buttonSecondary}}
              onClick={saveCurrentState}
            >
              💾 {t.save}
            </button>

            <button
              style={{...interfaceStyles.button, ...interfaceStyles.buttonSuccess}}
              onClick={exportHTML}
            >
              ⬇️ {t.export}
            </button>

            <button
              style={{...interfaceStyles.button, ...interfaceStyles.buttonSecondary}}
              onClick={resetPositions}
            >
              🔄 {t.reset}
            </button>
          </>
        )}

        {/* Panneau d'édition */}
        {selectedElement && viewMode === 'edit' && (
          <div style={interfaceStyles.editPanel}>
            <div style={interfaceStyles.editTitle}>
              <span>
                📝 {t.editing} {selectedElement.tagName.toLowerCase()}
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={deselectElement}
                  style={{
                    padding: '6px 10px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    backgroundColor: 'white',
                    color: '#64748b',
                    cursor: 'pointer',
                    fontSize: '11px'
                  }}
                >
                  ✕ {t.deselect}
                </button>
                <button onClick={deleteSelectedElement} style={interfaceStyles.deleteButton}>
                  🗑️ {t.delete}
                </button>
              </div>
            </div>

            {/* Bouton d'édition inline */}
            <button
              onClick={() => startInlineEditing()}
              style={interfaceStyles.inlineEditButton}
              disabled={isInlineEditing}
            >
              {isInlineEditing ? `✓ ${t.editingInProgress}` : `✏️ ${t.editDirectly}`}
            </button>

            {/* Bouton de traduction individuelle */}
            <button
              onClick={translateSelectedElement}
              style={{
                ...interfaceStyles.inlineEditButton,
                backgroundColor: '#f59e0b',
                marginBottom: '16px'
              }}
              disabled={isTranslating}
            >
              🌐 {isTranslating ? t.translating : t.translateElement}
            </button>

            {/* Édition du texte */}
            <div style={interfaceStyles.inputGroup}>
              <label style={interfaceStyles.label}>{t.elementText}</label>
              <textarea
                value={editingText}
                onChange={(e) => updateElementText(e.target.value)}
                style={interfaceStyles.richTextarea}
                placeholder={t.elementText.replace(':', '...')}
              />
            </div>

            {/* Barre d'outils de formatage */}
            <div style={interfaceStyles.inputGroup}>
              <label style={interfaceStyles.label}>{t.formatting}</label>
              <div style={interfaceStyles.styleButtons}>
                <button
                  onClick={() => toggleElementStyle('fontWeight', 'bold', 'normal')}
                  style={{
                    ...interfaceStyles.styleButton,
                    ...(selectedElement.style.fontWeight === 'bold' ? interfaceStyles.activeStyleButton : {})
                  }}
                >
                  <strong>B</strong> {t.bold}
                </button>
                <button
                  onClick={() => toggleElementStyle('fontStyle', 'italic', 'normal')}
                  style={{
                    ...interfaceStyles.styleButton,
                    ...(selectedElement.style.fontStyle === 'italic' ? interfaceStyles.activeStyleButton : {})
                  }}
                >
                  <em>I</em> {t.italic}
                </button>
                <button
                  onClick={() => toggleElementStyle('textDecoration', 'underline', 'none')}
                  style={{
                    ...interfaceStyles.styleButton,
                    ...(selectedElement.style.textDecoration === 'underline' ? interfaceStyles.activeStyleButton : {})
                  }}
                >
                  <u>U</u> {t.underline}
                </button>
              </div>
              
              <div style={interfaceStyles.styleButtons}>
                <button
                  onClick={() => setElementAlignment('left')}
                  style={{
                    ...interfaceStyles.styleButton,
                    ...(selectedElement.style.textAlign === 'left' ? interfaceStyles.activeStyleButton : {})
                  }}
                >
                  ← {t.left}
                </button>
                <button
                  onClick={() => setElementAlignment('center')}
                  style={{
                    ...interfaceStyles.styleButton,
                    ...(selectedElement.style.textAlign === 'center' ? interfaceStyles.activeStyleButton : {})
                  }}
                >
                  ↔️ {t.center}
                </button>
                <button
                  onClick={() => setElementAlignment('right')}
                  style={{
                    ...interfaceStyles.styleButton,
                    ...(selectedElement.style.textAlign === 'right' ? interfaceStyles.activeStyleButton : {})
                  }}
                >
                  → {t.right}
                </button>
              </div>
            </div>

            {/* Couleur du texte */}
            <div style={interfaceStyles.inputGroup}>
              <label style={interfaceStyles.label}>{t.textColor}</label>
              <div style={interfaceStyles.colorInputGroup}>
                <input
                  type="color"
                  value={getElementTextColor()}
                  onChange={(e) => updateElementStyle('color', e.target.value)}
                  style={interfaceStyles.colorPicker}
                />
                <input
                  type="text"
                  value={getElementTextColor()}
                  onChange={(e) => updateElementStyle('color', e.target.value)}
                  style={{...interfaceStyles.input, flex: 1}}
                />
              </div>
            </div>

            {/* Couleur de fond */}
            <div style={interfaceStyles.inputGroup}>
              <label style={interfaceStyles.label}>{t.backgroundColor}</label>
              <div style={interfaceStyles.colorInputGroup}>
                <input
                  type="color"
                  value={getElementBackgroundColor()}
                  onChange={(e) => updateElementStyle('backgroundColor', e.target.value)}
                  style={interfaceStyles.colorPicker}
                />
                <input
                  type="text"
                  value={getElementBackgroundColor()}
                  onChange={(e) => updateElementStyle('backgroundColor', e.target.value)}
                  style={{...interfaceStyles.input, flex: 1}}
                />
              </div>
            </div>

            {/* Taille de police */}
            <div style={interfaceStyles.inputGroup}>
              <label style={interfaceStyles.label}>{t.fontSize} {getElementFontSize()}px</label>
              <input
                type="range"
                min="8"
                max="72"
                value={parseInt(getElementFontSize()) || 16}
                onChange={(e) => updateElementStyle('fontSize', e.target.value + 'px')}
                style={interfaceStyles.slider}
              />
            </div>

            {/* Aperçu HTML */}
            <div style={interfaceStyles.inputGroup}>
              <label style={interfaceStyles.label}>{t.htmlPreview}</label>
              <div style={interfaceStyles.htmlPreview}>
                {selectedElement.outerHTML.length > 200 
                  ? selectedElement.outerHTML.substring(0, 200) + '...'
                  : selectedElement.outerHTML
                }
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div style={{ 
          marginTop: '16px', 
          padding: '12px', 
          backgroundColor: '#f8fafc', 
          borderRadius: '6px', 
          fontSize: '11px', 
          color: '#4b5563' 
        }}>
          <strong>{t.instructions}</strong>
          <ul style={{ margin: '4px 0', paddingLeft: '12px' }}>
            <li><strong>{t.clickSelect}</strong></li>
            <li><strong>{t.doubleClickEdit}</strong></li>
            <li><strong>{t.panelEdit}</strong></li>
            <li><strong>{t.enterValidate}</strong></li>
            <li><strong>{t.escapeCancel}</strong></li>
          </ul>
          {selectedElement && (
            <div style={{ 
              marginTop: '8px', 
              padding: '6px', 
              backgroundColor: '#dbeafe', 
              borderRadius: '4px',
              color: '#1e40af',
              fontSize: '10px'
            }}>
              ✓ {t.elementSelected} <strong>{selectedElement.tagName.toLowerCase()}</strong>
              <br />
              {isInlineEditing ? (
                <span style={{ color: '#059669' }}>✏️ {t.editingNow}</span>
              ) : (
                <span>💡 {t.doubleClickTip}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Zone de contenu */}
      <div style={interfaceStyles.canvasContainer}>
        <div style={interfaceStyles.header}>
          <h1 style={interfaceStyles.pageTitle}>
            {viewMode === 'edit' ? t.editMode : t.previewMode}
          </h1>
          <p style={interfaceStyles.pageSubtitle}>
            {viewMode === 'edit' ? t.editSubtitle : t.previewSubtitle}
          </p>
        </div>

        <div style={interfaceStyles.htmlContainer}>
          <div style={interfaceStyles.modeIndicator}>
            {viewMode === 'edit' ? 'ÉDITION' : 'APERÇU'}
          </div>

          {htmlContent ? (
            <iframe
              ref={iframeRef}
              style={interfaceStyles.iframe}
              title="HTML Content"
            />
          ) : (
            <div style={interfaceStyles.emptyState}>
              📝
              <h3 style={{ margin: '0 0 8px 0' }}>{t.noFileLoaded}</h3>
              <p style={{ margin: 0 }}>{t.loadFilePrompt}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;