* will fix format of  references when it's completely done

### Brief Description:

Whether they be in dirt, in water, in the air, on skin or in the gut, bacteria
generally occur in communities. In microbial communities, the survival of all
species are interdependent due to the biochemical and behavioral activities of
one species that provide the necessary metabolites and living environment for
another [1]. Many approaches have been developed for predicting flux
distributions in the metabolic network of one species using flux balance
analysis (FBA) in order to optimize for biomass or product formation [2,3]. Flux
balance analysis has been used for a variety of applications, including drug
target identification by evaluation of gene essentiality, knowledge-gap filling
of metabolic models and metabolic engineering of E. coli for lycopene synthesis
[4-6]. However, algorithms to perform FBA at a community level have been few and
complicated (often using non-linear programming and very difficult to solve);
since in community FBA (cFBA), the exchange of metabolites between species, the
biomass, relative fitness and competitive ability of each species affect
metabolic flux within the community and within each individual species [4-6].
MetaFlux, a web tool developed by the Toronto iGEM Team, carries out cFBA
between user custom-chosen bacterial species with a linear-programming algorithm
and displays the results by an interactive and easily-understandable node-edge
visualization.

### Web Application: Framework of the MetaFlux Interface

MetaFlux was developed using D3.JS, a JavaScript library for creation of
interactive networks using nodes and edges. The object of the MetaFlux web tool
is to visualize and manipulate community level metabolic networks in the tool’s
“extracellular view” in addition to visualizing species-specific cytoplasmic
networks in the “cytoplasmic view”, to see flux distributions in each of these
views, and to see changes in flux distributions occurring from any alterations
made to the metabolic network. Asynchronous calls to the backend optimize the
network using an iGEM Toronto Python script which in turn, uses COBRApy, a
constraint-based modeling package was used to model metabolic networks from
metabolic models in the form of SBML (Synthetic Biology Markup Language) XML
data.

### Algorithm

Firstly, we create metabolic models, in SBML file format, for each individual
species that are present in the community. Each metabolic model is tailored to
contain extra external metabolites and reactions that are contributed from other
species in the community. Thus, the extracellular space of each metabolic model
is unique to each individual species despite the fact that all members belong to
the same community. After the creation of individual metabolic models, we use
COBRApy to optimize for each model’s biomass objective function and subsequently
store the solutions in text files. Using the solutions, we calculate and store
the averages and standard deviations for all shared reactions in the community
in a new text file. With this, we change the upper and lower bounds, of each
reaction of all the species’ models, to the average flux value plus two standard
deviations and the average flux value minus two standard deviations
respectively. With new constraints on shared reactions, we perform flux balance
analysis again iteratively for each model with COBRApy, again optimizing for
each respective biomass objective function. We then store each flux value
returned by the objective function of each species in another new text file. We
take the flux values and calculate z-scores compared to each other. Fractional
biomass coefficients will be calculated for each species by taking their
respective z-score and diving over the sum of z-scores for all species and will
be stored in another text file. The sum of all fractional biomass coefficient
should equal to one. Lastly, a community metabolic model will be created where
species are treated as just additional compartments. However, the constraints in
the model and/or variables in the objective function for this community model
will be weighed by their respective fractional biomass coefficients depending on
which species the constraint or variable belongs to. Constraints and/or
variables for reactions that are shared between species will be weighed as the
sum of the fractional biomass coefficients for the species involved. The final
step is to then use COBRApy to optimize for the community biomass objective
function, which is defined as the weighed summation of biomass objective
functions of all species. The resultant vector of fluxes is predicted to be
representative of real-world experimental data.  

### Web Application: User Interaction

With MetaFlux, the user has the ability to choose to display the extracellular
metabolic network of one species, the extracellular metabolic network of
multiple species, the cytoplasmic-periplasmic metabolic network of a single
species, or a certain metabolic pathway within one species. The visualization
will include small circular nodes to represent metabolites, hexagonal nodes to
display reactions, big circular nodes to represent species and arrows to define
a particular pathway between the nodes. The user has the ability to add in
pathways (metabolites and reactions) and remove pathways either from the web
tool’s available data or based on their own experimentally-collected data. FBA
calculations and optimizations will occur on the backend and display the results
on the network as visually distinguishable changes in the thickness of the
arrows. The user also has the capability of zooming into the network and
repositioning the networks and its subparts by mouse-dragging. Finally, the user
will have the option of storing the experiment and the settings for each
optimization for future use.

### References

1. Zelezniak, Aleksej et al. “Metabolic Dependencies Drive Species Co-Occurrence in Diverse Microbial Communities.” Proceedings of the National Academy of Sciences of the United States of America 112.20 (2015): 6449–6454. PMC. Web. 9 Sept. 2015. http://www.ncbi.nlm.nih.gov/pmc/articles/PMC4443341/
2. Radhakrishnan Mahadevan, Jeremy S. Edwards, Francis J. Doyle III, Dynamic Flux Balance Analysis of Diauxic Growth in Escherichia coli, Biophysical Journal, Volume 83, Issue 3, September 2002, Pages 1331-1340, ISSN 0006-3495, http://dx.doi.org/10.1016/S0006-3495(02)73903-9.
(http://www.sciencedirect.com/science/article/pii/S0006349502739039)

3. Jong Min Lee, Erwin P. Gianchandani, and Jason A. Papin
Flux balance analysis in the era of metabolomics
Brief Bioinform 2006 7: 140-150.

4. Raman K, Rajagopalan P, Chandra N. Flux balance analysis of mycolic acid pathway: targets for anti-tubercular drugs. PLoS Comput Biol 2005;1:e46.

5. Oberhardt MA, Puchalka J, Fryer KE, et al. Genome-scale metabolic network analysis of the opportunistic pathogen Pseudomonas aeruginosa PAO1. J Bacteriol2008;190:2790-803.

6. Alper H, Jin Y-S, Moxley JF, et al. Identifying gene targets for the metabolic engineering of lycopene biosynthesis in Escherichia coli. Metab Eng 2005;7:155-64.
7. Khandelwal RA, Olivier BG, Röling WFM, Teusink B, Bruggeman FJ (2013) Community Flux Balance Analysis for Microbial Consortia at Balanced Growth. PLoS ONE 8(5): e64567. doi:10.1371/journal.pone.0064567
8. http://journal.frontiersin.org/article/10.3389/fmicb.2014.00125/full
9. http://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1002363
