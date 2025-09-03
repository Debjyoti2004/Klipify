'use client';

import {
    FileVideo,
    Zap,
    Shield,
    Clock,
    Upload,
    Play,
    Settings,
    Users,
    Star,
    ArrowRight,
    CheckCircle,
    Globe,
    Smartphone,
    Monitor,
    Cloud,
    Award,
    TrendingUp,
    Linkedin,
    Github
} from 'lucide-react';

interface HomePageProps {
    onNavigateToUpload: () => void;
    onNavigateToDemo: () => void;
}

export function HomePage({ onNavigateToUpload, onNavigateToDemo }: HomePageProps) {

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                <FileVideo className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Klipify
                            </h1>
                        </div>
                        <nav className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
                            <a href="#pricing" className="text-slate-300 hover:text-white transition-colors">Pricing</a>
                            <a href="#about" className="text-slate-300 hover:text-white transition-colors">About</a>
                            <button
                                onClick={onNavigateToUpload}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
                            >
                                Get Started
                            </button>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
                        Transform Videos
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 pb-2">
                            Like Magic
                        </span>
                    </h2>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed">
                        Professional video transcoding platform that converts, optimizes, and delivers your content
                        with industry-leading speed and quality. Upload once, stream everywhere.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={onNavigateToUpload}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl font-semibold text-lg flex items-center justify-center cursor-pointer"
                        >
                            <Upload className="w-5 h-5 mr-2" />
                            Start Transcoding
                        </button>
                        <button 
                            onClick={onNavigateToDemo}
                            className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20 font-semibold text-lg flex items-center justify-center cursor-pointer"
                        >
                            <Play className="w-5 h-5 mr-2" />
                            Watch Demo
                        </button>
                    </div>
                </div>
            </section>

            {/* Key Features */}
            <section id="features" className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h3 className="text-4xl font-bold text-white mb-4">Powerful Features</h3>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                            Everything you need for professional video processing
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                            <Zap className="w-12 h-12 text-blue-400 mb-6 group-hover:scale-110 transition-transform" />
                            <h4 className="text-xl font-bold text-white mb-4">Lightning Fast</h4>
                            <p className="text-slate-400">Process videos 10x faster with our optimized cloud infrastructure and parallel processing.</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                            <Shield className="w-12 h-12 text-purple-400 mb-6 group-hover:scale-110 transition-transform" />
                            <h4 className="text-xl font-bold text-white mb-4">Enterprise Security</h4>
                            <p className="text-slate-400">Bank-level encryption and secure cloud storage with SOC 2 compliance.</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                            <Globe className="w-12 h-12 text-green-400 mb-6 group-hover:scale-110 transition-transform" />
                            <h4 className="text-xl font-bold text-white mb-4">Global CDN</h4>
                            <p className="text-slate-400">Deliver your videos worldwide with our edge network for optimal performance.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Supported Formats */}
            <section className="py-20 bg-black/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h3 className="text-4xl font-bold text-white mb-4">Universal Format Support</h3>
                        <p className="text-xl text-slate-400">Upload any video format, get optimized output</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                        {['MP4', 'AVI', 'MOV', 'WMV', 'FLV', 'MKV', 'WEBM', 'M4V', '3GP', 'OGV'].map((format) => (
                            <div key={format} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 text-center border border-white/10 hover:bg-white/10 transition-all duration-300">
                                <FileVideo className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                                <span className="text-white font-semibold">{format}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h3 className="text-4xl font-bold text-white mb-4">How It Works</h3>
                        <p className="text-xl text-slate-400">Simple 3-step process</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center group">
                            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-2xl">
                                <Upload className="w-10 h-10 text-white" />
                            </div>
                            <h4 className="text-2xl font-bold text-white mb-4">1. Upload</h4>
                            <p className="text-slate-400">Drag and drop your videos or click to browse. All formats supported.</p>
                        </div>
                        <div className="text-center group">
                            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-2xl">
                                <Settings className="w-10 h-10 text-white" />
                            </div>
                            <h4 className="text-2xl font-bold text-white mb-4">2. Process</h4>
                            <p className="text-slate-400">Our AI-powered engine optimizes your videos for quality and performance.</p>
                        </div>
                        <div className="text-center group">
                            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-2xl">
                                <Play className="w-10 h-10 text-white" />
                            </div>
                            <h4 className="text-2xl font-bold text-white mb-4">3. Stream</h4>
                            <p className="text-slate-400">Download or stream your optimized videos instantly across all devices.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-20 bg-black/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bold text-white mb-2">10M+</div>
                            <div className="text-slate-400">Videos Processed</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bold text-white mb-2">99.9%</div>
                            <div className="text-slate-400">Uptime</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bold text-white mb-2">50K+</div>
                            <div className="text-slate-400">Happy Users</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bold text-white mb-2">24/7</div>
                            <div className="text-slate-400">Support</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Device Compatibility */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h3 className="text-4xl font-bold text-white mb-4">Works Everywhere</h3>
                        <p className="text-xl text-slate-400">Optimized for all devices and platforms</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 text-center hover:bg-white/10 transition-all duration-300">
                            <Smartphone className="w-16 h-16 text-blue-400 mx-auto mb-6" />
                            <h4 className="text-xl font-bold text-white mb-4">Mobile First</h4>
                            <p className="text-slate-400">Optimized for iOS and Android with responsive design and touch controls.</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 text-center hover:bg-white/10 transition-all duration-300">
                            <Monitor className="w-16 h-16 text-purple-400 mx-auto mb-6" />
                            <h4 className="text-xl font-bold text-white mb-4">Desktop Power</h4>
                            <p className="text-slate-400">Full-featured desktop experience with advanced controls and batch processing.</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 text-center hover:bg-white/10 transition-all duration-300">
                            <Cloud className="w-16 h-16 text-green-400 mx-auto mb-6" />
                            <h4 className="text-xl font-bold text-white mb-4">Cloud Native</h4>
                            <p className="text-slate-400">Access your videos anywhere with cloud sync and real-time collaboration.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-black/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h3 className="text-4xl font-bold text-white mb-4">Trusted by Creators</h3>
                        <p className="text-xl text-slate-400">See what our users are saying</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                            <div className="flex items-center mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                ))}
                            </div>
                            <p className="text-slate-300 mb-6">"Klipify transformed our video workflow. What used to take hours now takes minutes. The quality is incredible!"</p>
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-white font-bold">SJ</span>
                                </div>
                                <div>
                                    <div className="text-white font-semibold">Sarah Johnson</div>
                                    <div className="text-slate-400 text-sm">Content Creator</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                            <div className="flex items-center mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                ))}
                            </div>
                            <p className="text-slate-300 mb-6">"The best video processing platform we've used. Fast, reliable, and the API integration was seamless."</p>
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-white font-bold">MR</span>
                                </div>
                                <div>
                                    <div className="text-white font-semibold">Mike Rodriguez</div>
                                    <div className="text-slate-400 text-sm">Tech Lead</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                            <div className="flex items-center mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                ))}
                            </div>
                            <p className="text-slate-300 mb-6">"Klipify's quality settings are unmatched. Our clients love the crystal-clear output quality."</p>
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-white font-bold">AL</span>
                                </div>
                                <div>
                                    <div className="text-white font-semibold">Anna Lee</div>
                                    <div className="text-slate-400 text-sm">Video Producer</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h3 className="text-4xl font-bold text-white mb-4">Simple Pricing</h3>
                        <p className="text-xl text-slate-400">Choose the plan that fits your needs</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                            <h4 className="text-2xl font-bold text-white mb-2">Starter</h4>
                            <div className="text-4xl font-bold text-white mb-6">$9<span className="text-lg text-slate-400">/month</span></div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center text-slate-300">
                                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                                    10 hours processing/month
                                </li>
                                <li className="flex items-center text-slate-300">
                                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                                    1080p max quality
                                </li>
                                <li className="flex items-center text-slate-300">
                                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                                    Basic support
                                </li>
                            </ul>
                            <button className="w-full bg-white/10 text-white py-3 rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20 cursor-pointer">
                                Get Started
                            </button>
                        </div>
                        <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl rounded-3xl p-8 border border-blue-400/30 relative">
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                                    Most Popular
                                </span>
                            </div>
                            <h4 className="text-2xl font-bold text-white mb-2">Professional</h4>
                            <div className="text-4xl font-bold text-white mb-6">$29<span className="text-lg text-slate-400">/month</span></div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center text-slate-300">
                                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                                    100 hours processing/month
                                </li>
                                <li className="flex items-center text-slate-300">
                                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                                    4K max quality
                                </li>
                                <li className="flex items-center text-slate-300">
                                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                                    Priority support
                                </li>
                                <li className="flex items-center text-slate-300">
                                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                                    API access
                                </li>
                            </ul>
                            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg cursor-pointer">
                                Start Free Trial
                            </button>
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                            <h4 className="text-2xl font-bold text-white mb-2">Enterprise</h4>
                            <div className="text-4xl font-bold text-white mb-6">Custom</div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center text-slate-300">
                                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                                    Unlimited processing
                                </li>
                                <li className="flex items-center text-slate-300">
                                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                                    8K max quality
                                </li>
                                <li className="flex items-center text-slate-300">
                                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                                    24/7 dedicated support
                                </li>
                                <li className="flex items-center text-slate-300">
                                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                                    Custom integrations
                                </li>
                            </ul>
                            <button className="w-full bg-white/10 text-white py-3 rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20 cursor-pointer">
                                Contact Sales
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Performance Metrics */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h3 className="text-4xl font-bold text-white mb-4">Industry Leading Performance</h3>
                        <p className="text-xl text-slate-400">Benchmarked against the competition</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 text-center">
                            <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-4" />
                            <div className="text-3xl font-bold text-white mb-2">10x</div>
                            <div className="text-slate-400">Faster Processing</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 text-center">
                            <Award className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                            <div className="text-3xl font-bold text-white mb-2">95%</div>
                            <div className="text-slate-400">Quality Retention</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 text-center">
                            <Clock className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                            <div className="text-3xl font-bold text-white mb-2">30s</div>
                            <div className="text-slate-400">Average Processing</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 text-center">
                            <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                            <div className="text-3xl font-bold text-white mb-2">150+</div>
                            <div className="text-slate-400">Countries Served</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Transform Your Videos?
                    </h3>
                    <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
                        Join thousands of creators and businesses who trust Klipify for their video processing needs.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={onNavigateToUpload}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl font-semibold text-lg flex items-center justify-center cursor-pointer"
                        >
                            Start Free Trial
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </button>
                        <button 
                            onClick={onNavigateToDemo}
                            className="bg-white/10 backdrop-blur-md text-white px-12 py-4 rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20 font-semibold text-lg cursor-pointer"
                        >
                            Watch Demo
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black/40 backdrop-blur-xl border-t border-white/10 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <FileVideo className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold text-white">Klipify</span>
                            </div>
                            <p className="text-slate-400">Professional video transcoding for the modern web.</p>
                        </div>
                        <div>
                            <h5 className="text-white font-semibold mb-4">Product</h5>
                            <ul className="space-y-2 text-slate-400">
                                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="text-white font-semibold mb-4">Company</h5>
                            <ul className="space-y-2 text-slate-400">
                                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="text-white font-semibold mb-4">Support</h5>
                            <ul className="space-y-2 text-slate-400">
                                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-white/10 mt-12 pt-8 text-center text-slate-400">
                        <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                            <p>&copy; 2025 Klipify. All rights reserved.</p>
                            <div className="flex items-center space-x-4 text-sm">
                                <p className="flex items-center space-x-2">
                                    <span>Built with</span>
                                    <span className="text-red-400">❤️</span>
                                    <span>by</span>
                                    <span className="font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                        Debjyoti
                                    </span>
                                </p>
                                <div className="flex items-center space-x-3">
                                    <a 
                                        href="https://www.linkedin.com/in/debjyotishit/" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="p-2 text-slate-400 hover:text-blue-400 transition-all duration-300 hover:bg-blue-500/10 rounded-lg hover:scale-110"
                                        title="Connect on LinkedIn"
                                    >
                                        <Linkedin className="w-4 h-4" />
                                    </a>
                                    <a 
                                        href="https://github.com/Debjyoti2004" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="p-2 text-slate-400 hover:text-white transition-all duration-300 hover:bg-slate-700/50 rounded-lg hover:scale-110"
                                        title="View on GitHub"
                                    >
                                        <Github className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}