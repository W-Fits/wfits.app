.. The WFits Project documentation master file, created by
   sphinx-quickstart on Tue Apr  8 12:46:37 2025.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

The WFits Project documentation
===============================

Add your content using ``reStructuredText`` syntax. See the
`reStructuredText <https://www.sphinx-doc.org/en/master/usage/restructuredtext/index.html>`_
documentation for details.


Overview
--------

The Weather Clothing System is a core feature designed to enhance outfit recommendations by considering real-time and forecasted weather data. The system ensures that users receive practical, weather-appropriate clothing suggestions to improve comfort and user satisfaction.

System Requirements Mapping
----------------------------

- **Requirement 6**: The user should receive suggestions that take into account the weather.
- **Sub-requirements**:
  
  - **6.1** The system will integrate with weather APIs to fetch current and forecast weather data.
  - **6.2** The system will apply the weather conditions when generating outfit suggestions.
  - **6.3** The system shall allow users to view recommended outfits for different weather conditions.

Technology Stack
----------------

The following technologies and components are used to implement the Weather Clothing System, as shown in the System Architecture diagram:

- **Web Client UI**:
  
  - Built using **Next.js** (React Framework) for server-side rendering and enhanced performance.

- **Application Layer**:
  
  - **Node.js Server (Next.js BFF)**:
    
    - Acts as a Backend-for-Frontend (BFF) to manage communication between the UI and microservices.
    - Fetches weather data and processes user requests.

- **External Entities**:
  
  - **Weather API**:
    
    - An external service providing real-time and forecasted weather conditions.
  
  - **Identity Provider (IdP)**:
    
    - Used for secure user authentication and authorization.

- **Domain Entities**:
  
  - **OutfitGen Microservice**:
    
    - Responsible for generating outfit recommendations based on user wardrobe items, preferences, and weather data.

  - **ClothingProcessor Microservice**:
    
    - Manages clothing item uploads, categorization, and metadata storage.

- **Storage Systems**:
  
  - **Object Store**:
    
    - Stores images of clothing items uploaded by users.
  
  - **Database**:
    
    - Stores user profiles, wardrobes, saved outfits, preferences, and activity plans.

Architecture Integration
-------------------------

- The Node.js server communicates with the Weather API to retrieve weather data.
- Weather data is forwarded to the OutfitGen microservice.
- The OutfitGen microservice processes this information, along with user wardrobe data, to generate relevant outfit recommendations.
- The final outfits are returned to the Web Client UI for user display.

Data Flow
---------

1. The Node.js Server fetches current and forecasted weather data from the Weather API.
2. Weather data is parsed to extract essential parameters like temperature, precipitation, humidity, and wind.
3. The OutfitGen Microservice uses weather parameters to:
   
   - Select appropriate clothing items (e.g., jackets for cold weather, light clothing for warm days).
   - Recommend necessary accessories (e.g., umbrellas for rain, sunglasses for sunny conditions).
4. Recommended outfits are returned to the Web Client UI for display.

Functional and Non-Functional Requirements
-------------------------------------------

- **Functional Requirements**:
  
  - Integration with external Weather APIs. (6.1)
  - Application of weather conditions in outfit generation. (6.2)
  - Presentation of weather-specific outfit recommendations. (6.3)

- **Non-Functional Requirements**:
  
  - Weather data updates at least every 30 minutes.
  - API call response times must be less than 2 seconds.
  - Secure API communications using HTTPS protocols.

